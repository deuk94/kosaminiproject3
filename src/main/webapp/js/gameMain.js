new Vue({
    el: '#app',
    data: {
        coin: [], // 코인 데이터를 저장할 배열
        volume: [],
        chart: null, // 차트를 저장할 변수
        volumeChart: null,
        lastDate: null,
        lastClose: 0,
        sma5: [],
        sma10: [],
        sma20: [],
        sma60: [],
        market: 'KRW-BTC'
    },
    mounted() {
        this.market = this.getQueryParameter('asset') || 'BTC';
        this.getData();
    },
    methods: {
        getQueryParameter: function(name) {
            const urlParams = new URLSearchParams(window.location.search);
            console.log(urlParams.get(name));
            return urlParams.get(name) ? `${urlParams.get(name)}` : 'KRW-BTC';
        },
        getData: function () {
            axios.get('https://api.upbit.com/v1/candles/days', {
                params: {
                    market: this.market,
                    to: '2024-06-01T09:00:00Z',
                    count: 200,
                }
            }).then((response) => {
                this.coin = response.data.map(candle => ({
                    x: new Date(candle.candle_date_time_kst),
                    o: candle.opening_price,
                    h: candle.high_price,
                    l: candle.low_price,
                    c: candle.trade_price
                }));
                this.volume = response.data.map(candle => ({
                    x: new Date(candle.candle_date_time_kst),
                    y: candle.candle_acc_trade_volume
                }));

                this.lastDate = new Date(response.data[0].candle_date_time_kst);
                this.lastDate.setDate(this.lastDate.getDate()+1);

                this.lastClose = this.coin[0].c;
                //초기값 세팅
                $("#currentPrice").data("value",this.lastClose);
                $("#currentPrice").text(this.lastClose.toLocaleString());
                this.renderChart(); // 데이터를 가져온 후 차트를 렌더링
                this.renderVolumeChart();
            }).catch((error) => {
                console.error('Error fetching data:', error);
            });
        },
        renderChart: function () {
            const ctx = document.getElementById('coinChart').getContext('2d');

            if (this.chart) {
                this.chart.destroy(); // 기존 차트가 있으면 삭제
            }

            this.sma5 = calculateSMA(this.coin, 5);
            this.sma10 = calculateSMA(this.coin, 10);
            this.sma20 = calculateSMA(this.coin, 20);
            this.sma60 = calculateSMA(this.coin, 60);
            this.chart = new Chart(ctx, {
                type: 'candlestick',
                data: {
                    datasets: [{
                        label: this.market,
                        data: this.coin,
                        borderColors: {
                            up: 'red',
                            down: 'blue',
                            unchanged: '#999'
                        }, // 캔들 경계선 색상
                        backgroundColors: {
                            up: 'red',
                            down: 'blue',
                            unchanged: '#999'
                        }, // 캔들 내부 색상
                        barPercentage: 0.032, // 각 캔들의 상대적인 너비 설정 (0~1 사이의 값)
                        categoryPercentage: 0.7 // 각 카테고리(날짜)의 상대적인 너비 설정
                    },
                        {
                            label: '5',
                            type: 'line',
                            data: this.sma5,
                            borderColor: 'blue',
                            borderWidth: 1,
                            pointRadius: 0,
                            fill: false,
                        },
                        {
                            label: '10',
                            type: 'line',
                            data: this.sma10,
                            borderColor: 'red',
                            borderWidth: 1,
                            pointRadius: 0,
                            fill: false,

                        },
                        {
                            label: '20',
                            type: 'line',
                            data: this.sma20,
                            borderColor: 'yellow',
                            borderWidth: 1,
                            pointRadius: 0,
                            fill: false,
                        },
                        {
                            label: '60',
                            type: 'line',
                            data: this.sma60,
                            borderColor: 'green',
                            borderWidth: 1,
                            pointRadius: 0,
                            fill: false,
                        }]
                },
                options: {
                    responsive: false,
                    animation: false,
                    maintainAspectRatio: false,

                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day'
                            },
                            ticks: {
                                source: 'auto'
                            },
                            offset: true,
                            display: true,
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: false,
                            position: 'right',
                            grid: {
                                display: false
                            }
                        }
                    },
                    plugins: {

                        legend: {
                            display: true,
                            position: 'top', // 범례 위치를 상단으로 설정
                            align: 'start', // 범례를 왼쪽으로 정렬
                            labels: {
                                usePointStyle: true, // 범례 마커를 점으로 변경
                                boxWidth: 0, // 범례 박스 너비를 0으로 설정하여 사라지게 함
                                padding: 10, // 범례 항목 간의 패딩
                                color: 'black', // 텍스트 색상 설정
                                font: {
                                    size: 18, // 범례 텍스트 크기 설정 (예: 16px)
                                    weight: 'bold' // 텍스트 굵기 설정 (선택 사항)
                                },

                            },
                        },
                        tooltip: {
                            enabled: true,
                            mode: 'nearest',
                            intersect: false, // 커서가 캔들에 정확히 교차하지 않아도 툴팁이 보이도록 설정
                            filter: function (tooltipItem) {
                                return tooltipItem.datasetIndex === 0; // 첫 번째 데이터셋(BTC)만 툴팁을 표시
                            },
                            callbacks: {
                                title: function(tooltipItems) {
                                    if (tooltipItems.length > 0 && tooltipItems[0].label) {
                                        return `Date: ${tooltipItems[0].label}`;
                                    } else {
                                        return ''; // label이 없을 경우 빈 문자열 반환
                                    }
                                },
                                label: function(tooltipItems) {
                                    let ohlc = tooltipItems.formattedValue.split(' ');
                                    return [
                                        `Open: ${ohlc[1]}`,
                                        `High: ${ohlc[4]}`,
                                        `Low: ${ohlc[7]}`,
                                        `Close: ${ohlc[10]}`,
                                    ]}
                            }
                        }
                    }
                }
            });
        },
        renderVolumeChart: function () {
            const ctx = document.getElementById('volumeChart').getContext('2d');
            ctx.canvas.height = 200;

            if (this.volumeChart) {
                this.volumeChart.destroy();
            }

            this.volumeChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    datasets: [{
                        label: 'Volume',
                        data: this.volume,
                        backgroundColor: (context) => {
                            const index = context.dataIndex;
                            const currentCandle = this.coin[index];
                            return currentCandle.c > currentCandle.o ? 'red' : 'blue';
                        },
                        barPercentage: 0.9, // 각 캔들의 상대적인 너비 설정 (0~1 사이의 값)
                        categoryPercentage: 1
                    }]
                },
                options: {
                    responsive: false,
                    animation: false,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day'
                            },
                            ticks: {
                                display: false,
                                source: 'auto'
                            },
                            offset: true,
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            position: 'right',
                            grid: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false // 범례 숨기기
                        },
                        tooltip: {
                            enabled: true,
                            mode: 'nearest',
                            intersect: false,
                            callbacks: {
                                title: function(tooltipItems) {
                                    return `Date: ${tooltipItems[0].label}`;
                                },
                                label: function(tooltipItems) {
                                    return `Volume: ${tooltipItems.formattedValue}`;
                                }
                            }
                        }
                    }
                }
            });
        },
        addNextCandle: function(){
            this.lastDate.setDate(this.lastDate.getDate()+1);

            axios.get('https://api.upbit.com/v1/candles/days', {
                params: {
                    market: this.market,
                    to: this.lastDate,
                    count: 1,
                }
            }).then((response) => {

                let coin = response.data[0];
                let newCoin = {
                    x: new Date(coin.candle_date_time_kst),
                    o: coin.opening_price,
                    h: coin.high_price,
                    l: coin.low_price,
                    c: coin.trade_price
                };
                let newVolume = {
                    x: new Date(coin.candle_date_time_kst),
                    y: coin.candle_acc_trade_volume
                };

                this.coin.unshift(newCoin); // 데이터를 가져온 후 차트를 렌더링
                this.coin.pop();
                this.volume.unshift(newVolume);
                this.volume.pop();

                this.lastClose = newCoin.c;
                console.log(this.lastClose);
                this.sma5.unshift(OnceCalculateSMA(this.coin, 5));
                this.sma10.unshift(OnceCalculateSMA(this.coin, 10));
                this.sma20.unshift(OnceCalculateSMA(this.coin, 20));
                this.sma60.unshift(OnceCalculateSMA(this.coin, 60));

                // 게임 횟수 및 진행 바
                let turn = parseInt($("#turn").text());
                let lastTurn = parseInt($("#lastTurn").text());
                let turnWidth = 100 / lastTurn;
                $(".progressBarFill").css("width", turn * turnWidth + "%");
                if (turn >= lastTurn) {
                    parseInt($("#turn").text(lastTurn));
                    alert("게임이 끝났습니다.");

                } else {
                    turn++;
                    $("#turn").text(turn);
                    $('.progressBarFill').css("width", turn * turnWidth + "%");
                    $("#currentPrice").data("value",this.lastClose);
                    $("#currentPrice").text(this.lastClose.toLocaleString());
                    this.chart.update();
                    this.volumeChart.update();
                }
                // 현재가를 업데이트
                let price = $("#currentPrice").data("value");
                console.log("price : "+price)
                let newPrice = parseInt(price);
                let currentPrice = newPrice;

                // 매수 주문 단가 업데이트
                $("#orderPrice").data("value", currentPrice);
                $("#orderPrice").text(currentPrice.toLocaleString());

                // 매도 주문 단가 업데이트
                $("#orderPrice1").data("value", currentPrice);
                $("#orderPrice1").text(currentPrice.toLocaleString());

                // 매수 가능 코인 수량 업데이트
                // 수정 사항 - 주문 가능 코인 내림 처리
                $("#orderPossibility").data("value",
                    Math.floor(parseFloat($("#cash").data("value")) / parseFloat($("#currentPrice").data("value")))
                );
                $("#orderPossibility").text(
                    Math.floor(parseFloat($("#cash").data("value")) / parseFloat($("#currentPrice").data("value"))).toLocaleString()
                );

                // 코인 평가금 업데이트
                let coinValue= parseInt($("#coinCount").data("value")) * parseInt($("#currentPrice").data("value"));
                $("#coinValue").data("value", coinValue);
                $("#coinValue").text(coinValue.toLocaleString());

                // 총 평가 자산
                let totalValue = parseInt($("#cash").data("value")) + parseInt($("#coinValue").data("value"));
                $("#totalValue").data("value", totalValue);
                $("#totalValue").text(totalValue.toLocaleString());

                // 수익률
                let ROI;
                // 초기 수익률 초기화
                if (parseInt($("#coinValue").data("value")) === 0) {
                    ROI = 0;
                } else {
                    // 현재가에 따른 수익률
                    ROI = (((parseInt($("#coinValue").data("value")) - parseInt(initialAccount)) / parseInt(initialAccount)) * 100);
                }
                ROI = Math.round(ROI * 100) / 100; // 소수점 둘째자리 표시
                $("#changePercent").text("(" + ROI + "%)");
                $("#ROI").text(ROI + "%");
                // 수익률에 따른 색 변화
                if (ROI > 0) {
                    $("#changePercent").css("color", "red");
                    $("#ROI").css("color", "red");
                }  else if (ROI === 0) {
                    $("#changePercent").css("color", "black");
                    $("#ROI").css("color", "black");
                } else {
                    $("#changePercent").css("color", "blue");
                    $("#ROI").css("color", "blue");
                }
            }).catch((error) => {
                console.error('Error fetching data:', error);
            });
        },
    }
});

function calculateSMA(data, period) {
    let smaData = [];
    for (let i = 0; i < data.length-period; i++) {
        let sum = 0;
        for (let j = i; j < i+period; j++) {
            sum += data[j].c;
        }
        smaData.push({
            x: data[i].x,
            y: sum / period
        });
    }
    return smaData;
}
function OnceCalculateSMA(data, period) {
    let sum = 0;

    for (let j = 0; j < period; j++) {
        sum += data[j].c;
    }
    let smaData = {
        x: data[0].x,
        y: sum / period
    };
    return smaData;
}

// ------------------------------------------------ 모달 창 ----------------------------------------------------
$(document).ready(function () {
    // 매수 버튼 클릭 시 매수 모달 보이기
    $("#buyBtn").click(function () {
        $("#buyModal").show();
        $("#orderQuantity").val(0);

        // 현재가를 업데이트
        let price = $("#currentPrice").data("value");
        console.log("price : "+price)
        let newPrice = parseInt(price);
        let currentPrice = newPrice;

        // 매수 주문 단가 업데이트
        $("#orderPrice").data("value", currentPrice);
        $("#orderPrice").text(currentPrice.toLocaleString());

        $("#orderPossibility").data("value",
            Math.floor(parseFloat($("#cash").data("value")) / parseFloat($("#currentPrice").data("value")))
        );
        $("#orderPossibility").text(
            Math.floor(parseFloat($("#cash").data("value")) / parseFloat($("#currentPrice").data("value"))).toLocaleString()
        );
    });

    // 매도 버튼 클릭 시 매도 모달 보이기
    $("#sellBtn").click(function () {
        $("#sellModal").show();
        $("#orderQuantity").val(0);

        // 현재가를 업데이트
        let price = $("#currentPrice").data("value");
        console.log("price : "+price)
        let newPrice = parseInt(price);
        let currentPrice = newPrice;

        // 매도 주문 단가 업데이트
        $("#orderPrice1").data("value", currentPrice);
        $("#orderPrice1").text(currentPrice.toLocaleString());

        $("#orderPossibility").data("value",
            Math.floor(parseFloat($("#cash").data("value")) / parseFloat($("#currentPrice").data("value")))
        );
        $("#orderPossibility").text(
            Math.floor(parseFloat($("#cash").data("value")) / parseFloat($("#currentPrice").data("value"))).toLocaleString()
        );
    });

    // 매수 모달 닫기 (X 버튼 클릭 시)
    $("#buyClose").click(function () {
        $("#buyModal").hide();
    });

    // 매도 모달 닫기 (X 버튼 클릭 시)
    $("#sellClose").click(function () {
        $("#sellModal").hide();
    });

    // 매수 취소 버튼
    $("#cancel").click(function () {
        $("#buyModal").hide();
    });

    // 매도 취소 버튼
    $("#cancel1").click(function () {
        $("#sellModal").hide();
    });

    $(document).click(function (event) {
        // 매수 모달 바깥 영역 클릭 시 모달 닫기
        if ($(event.target).is("#buyModal")) {
            $("#buyModal").hide();
        }
        // 매도 모달 바깥 영역 클릭 시 모달 닫기
        if ($(event.target).is("#sellModal")) {
            $("#sellModal").hide();
        }
    });
});


// ------------------------------------------------ 기능구현 -------------------------------------------------------

let initialAccount = 100000000000; // 초기 자산
$("#cash").data("value", initialAccount); // 초기 보유
$("#cash").text(initialAccount.toLocaleString());
let coinCount = 0;
$("#coinCount").data("value", coinCount);
$("#coinCount").text(coinCount);

$(document).ready(function () {

// ------------------------------------------------ 매수 ----------------------------------------------------------

    // 매수 주문가능 코인 수량 업데이트
    // 수정 사항 - 주문 가능 코인 내림 처리
    $("#orderPossibility").data("value",
        Math.floor(parseFloat($("#cash").data("value")) / parseFloat($("#currentPrice").text()))
    );
    $("#orderPossibility").text(
        Math.floor(parseFloat($("#cash").data("value")) / parseFloat($("#currentPrice").text())).toLocaleString()
    );

    // 매수 주문 수량 입력 시
    // 수정 사항 - 매수시 기존 수량 넘어갈 시, 음수 입력시 다시 입력
    $("#orderQuantity").on("input", function () {
        let orderQuantity = parseInt($(this).val()) || 0; // 수량이 비어있을 경우 0으로 처리
        let orderPossibility = parseInt($("#orderPossibility").data("value")); // 매수 가능 수량
        if (orderQuantity > orderPossibility) {
            alert("입력한 주문 수량이 최대 가능 수량을 초과했습니다. 다시 입력해주세요.");
            $(this).val(""); // 입력 필드를 비웁니다
        } else if (orderQuantity < 0) {
            alert("주문 수량은 0보다 작을 수 없습니다. 다시 입력해주세요.");
            $(this).val(""); // 입력 필드를 비웁니다
        } else {
            // 총 매수 주문 금액 업데이트
            let totalOrderPrice = parseInt($("#currentPrice").text()) * orderQuantity;

            // 금액을 계산된 숫자로 저장해두고, 별도의 데이터 속성에 유지
            $("#totalOrderPrice").data("value", totalOrderPrice);

            // 쉼표를 추가하여 표시
            $("#totalOrderPrice").text(totalOrderPrice.toLocaleString());
        }
    });

    // 매수 10% 계산
    // 수정 사항 - 주문 가능 코인 내림 처리
    $("#percent1").click(function () {
        $("#orderQuantity").val(Math.floor($("#orderPossibility").data("value") * 0.1));
        let totalOrderPrice = parseInt($("#currentPrice").data("value")) * parseInt($("#orderQuantity").val());
        $("#totalOrderPrice").data("value", totalOrderPrice);
        // 총 매수 주문 금액 업데이트
        $("#totalOrderPrice").text(totalOrderPrice.toLocaleString());
    })

    // 매수 25% 계산
    // 수정 사항 - 주문 가능 코인 내림 처리
    $("#percent2").click(function () {
        $("#orderQuantity").val(Math.floor($("#orderPossibility").data("value") * 0.25));
        let totalOrderPrice = parseInt($("#currentPrice").data("value")) * parseInt($("#orderQuantity").val());
        $("#totalOrderPrice").data("value", totalOrderPrice);
        // 총 매수 주문 금액 업데이트
        $("#totalOrderPrice").text(totalOrderPrice.toLocaleString());
    });

    // 매수 50% 계산
    // 수정 사항 - 주문 가능 코인 내림 처리
    $("#percent3").click(function () {
        $("#orderQuantity").val(Math.floor($("#orderPossibility").data("value") * 0.5));
        let totalOrderPrice = parseInt($("#currentPrice").data("value")) * parseInt($("#orderQuantity").val());
        $("#totalOrderPrice").data("value", totalOrderPrice);
        // 총 매수 주문 금액 업데이트
        $("#totalOrderPrice").text(totalOrderPrice.toLocaleString());
    });

    // 매수 100% 계산
    // 수정 사항 - 주문 가능 코인 내림 처리
    $("#percent4").click(function () {
        $("#orderQuantity").val(Math.floor($("#orderPossibility").data("value")));
        let totalOrderPrice = parseInt($("#currentPrice").data("value")) * parseInt($("#orderQuantity").val());
        $("#totalOrderPrice").data("value", totalOrderPrice);
        // 총 매수 주문 금액 업데이트
        $("#totalOrderPrice").text(totalOrderPrice.toLocaleString());
    });

    // 매수 결과
    $("#buy").click(function () {
        $("#buyModal").hide(); //모달창 닫기
        // 보유현금 변화
        let changeCash = $("#cash").data("value") - $("#totalOrderPrice").data("value");
        $("#cash").text(changeCash.toLocaleString());
        $("#cash").data("value", changeCash);
        if (changeCash < 0) {
            $("#cash").text(0);
        }
        // 매수 가능 코인 수 변화
        let orderPossibility = Math.floor(parseFloat($("#cash").data("value")) / parseFloat($("#currentPrice").text()));
        $("#orderPossibility").data("value", orderPossibility);
        $("#orderPossibility").text(orderPossibility.toLocaleString());

        //보유 코인 수 변화
        let coinCount = parseInt($("#coinCount").data("value")) + parseInt($("#orderQuantity").val());
        $("#coinCount").data("value", coinCount);
        $("#coinCount").text(coinCount.toLocaleString());
        $("#orderPossibility1").data("value", $("#coinCount").data("value"));
        $("#orderPossibility1").text($("#coinCount").data("value").toLocaleString());

        // 코인 평가금액
        let coinValue = parseInt($("#coinCount").data("value")) * parseInt($("#currentPrice").data("value"));
        $("#coinValue").data("value", coinValue);
        $("#coinValue").text(coinValue.toLocaleString());

        // 총 평가 자산
        let totalValue = parseInt($("#cash").data("value")) + parseInt($("#coinValue").data("value"));
        $("#totalValue").data("value", totalValue);
        $("#totalValue").text(totalValue.toLocaleString());

        // 평단가
        let averagePrice = parseInt($("#coinValue").data("value")) / parseInt($("#coinCount").data("value"));
        $("#averagePrice").data("value", averagePrice);
        $("#averagePrice").text(averagePrice.toLocaleString());

        // 수익률
        let ROI = ((parseInt($("#totalValue").data("value")) - parseInt(initialAccount)) / parseInt(initialAccount) * 100);
        ROI = Math.round(ROI * 100) / 100; // 소수점 둘째자리 표시
        $("#changePercent").text("(" + ROI + "%)");
        $("#ROI").text(ROI + "%");
        // 수익률에 따른 색 변화
        if (ROI > 0) {
            $("#changePercent").css("color", "red");
            $("#ROI").css("color", "red");
        }  else if (ROI === 0) {
            $("#changePercent").css("color", "black");
            $("#ROI").css("color", "black");
        } else {
            $("#changePercent").css("color", "blue");
            $("#ROI").css("color", "blue");
        }

        // 매매 내역을 리스트에 추가
        $("#tradeList").append(
            `<tr>
                <td style="font-weight: bold; color: black"><span style="color : red">매수
                    </span>- 수량: ${parseInt($("#orderQuantity").val())}개, 
                    단가: ${(parseInt($("#currentPrice").data("value"))).toLocaleString()}원,
                    총금액: ${(parseInt($("#totalOrderPrice").data("value"))).toLocaleString()}원</td>
            </tr>`
        );

        // "매매내역이 없습니다." 문구 제거
        $("#history").hide();
    });

// ------------------------------------------------ 매도 ---------------------------------------------------------------
    // 매도 주문가능 코인 수량 업데이트
    // $("#orderPossibility1").data("value",$("#coinCount").data("value"));
    // $("#orderPossibility1").text((parseInt($("#coinCount").data("value"))).toLocaleString());

    // 매도 주문 수량 입력 시
    // 수정 사항 - 매도시 기존 수량 넘어갈 시, 음수 입력시 다시 입력
    $("#orderQuantity1").on("input", function () {
        let orderQuantity1 = parseInt($(this).val()) || 0; // 수량이 비어있을 경우 0으로 처리
        let orderPossibility1 = parseInt($("#orderPossibility1").data("value")); // 가능 수량
        if (orderQuantity1 > orderPossibility1) {
            alert("입력한 주문 수량이 최대 가능 수량을 초과했습니다. 다시 입력해주세요.");
            $(this).val(""); // 입력 필드를 비웁니다
        } else if (orderQuantity1 < 0) {
            alert("주문 수량은 0보다 작을 수 없습니다. 다시 입력해주세요.");
            $(this).val(""); // 입력 필드를 비웁니다
        } else {
            // 총 매수 주문 금액 업데이트
            $("#totalOrderPrice1").data("value", parseInt($("#currentPrice").data("value")) * orderQuantity1);
            $("#totalOrderPrice1").text((parseInt($("#currentPrice").data("value")) * orderQuantity1).toLocaleString());
        }
    });

    // 매도 10% 계산
    //수정 사항 - 매도시 코인 수량 내림처리
    $("#percent10").click(function () {
        $("#orderQuantity1").val(Math.floor($("#orderPossibility1").data("value") * 0.1));
        let totalOrderPrice = parseInt($("#currentPrice").data("value")) * parseInt($("#orderQuantity1").val());
        $("#totalOrderPrice1").data("value", totalOrderPrice);
        // 총 매수 주문 금액 업데이트
        $("#totalOrderPrice1").text(totalOrderPrice.toLocaleString());
    });

    // 매도 25% 계산
    //수정 사항 - 매도시 코인 수량 내림처리
    $("#percent25").click(function () {
        $("#orderQuantity1").val(Math.floor($("#orderPossibility1").data("value") * 0.25));
        let totalOrderPrice = parseInt($("#currentPrice").data("value")) * parseInt($("#orderQuantity1").val());
        $("#totalOrderPrice1").data("value", totalOrderPrice);
        // 총 매수 주문 금액 업데이트
        $("#totalOrderPrice1").text(totalOrderPrice.toLocaleString());
    });

    // 매도 50% 계산
    //수정 사항 - 매도시 코인 수량 내림처리
    $("#percent50").click(function () {
        $("#orderQuantity1").val(Math.floor($("#orderPossibility1").data("value") * 0.5));
        let totalOrderPrice = parseInt($("#currentPrice").data("value")) * parseInt($("#orderQuantity1").val());
        $("#totalOrderPrice1").data("value", totalOrderPrice);
        // 총 매수 주문 금액 업데이트
        $("#totalOrderPrice1").text(totalOrderPrice.toLocaleString());
    });

    // 매도 100% 계산
    //수정 사항 - 매도시 코인 수량 내림처리
    $("#percent100").click(function () {
        $("#orderQuantity1").val(Math.floor($("#orderPossibility1").data("value")));
        let totalOrderPrice = parseInt($("#currentPrice").data("value")) * parseInt($("#orderQuantity1").val());
        $("#totalOrderPrice1").data("value", totalOrderPrice);
        // 총 매수 주문 금액 업데이트
        $("#totalOrderPrice1").text(totalOrderPrice.toLocaleString());
    });

    // 매도 결과 적용 후 보유 현금
    $("#sell").click(function () {
        $("#sellModal").hide(); // 모달창 닫기
        //보유 현금 변화
        let changeCash = parseInt($("#cash").data("value")) + parseInt($("#totalOrderPrice1").data("value"));
        $("#cash").data("value", changeCash);
        $("#cash").text(changeCash.toLocaleString());

        // 보유 코인 수 및 매도 가능 코인 수 변화
        let coinCount = parseInt($("#coinCount").data("value")) - parseInt($("#orderQuantity1").val());
        $("#coinCount").data("value", coinCount);
        $("#coinCount").text(coinCount.toLocaleString());
        $("#orderPossibility1").data("value", $("#coinCount").data("value"));
        $("#orderPossibility1").text($("#coinCount").data("value").toLocaleString());

        // 코인 평가금액
        let coinValue = parseInt($("#coinCount").data("value")) * parseInt($("#currentPrice").data("value"));
        $("#coinValue").data("value", coinValue);
        $("#coinValue").text(coinValue.toLocaleString());

        // 총 평가 자산
        let totalValue = parseInt($("#cash").data("value")) + parseInt($("#coinValue").data("value"));
        $("#totalValue").data("value", totalValue);
        $("#totalValue").text(totalValue.toLocaleString());

        // 수익률
        let ROI = ((parseInt($("#totalValue").data("value")) - parseInt(initialAccount)) / parseInt(initialAccount) * 100);
        ROI = Math.round(ROI * 100) / 100; // 소수점 둘째자리 표시
        $("#changePercent").text("(" + ROI + "%)");
        $("#ROI").text(ROI + "%");

        // 수익률에 따른 색 변화
        if (ROI > 0) {
            $("#changePercent").css("color", "red");
            $("#ROI").css("color", "red");
        }  else if (ROI === 0) {
            $("#changePercent").css("color", "black");
            $("#ROI").css("color", "black");
        } else {
            $("#changePercent").css("color", "blue");
            $("#ROI").css("color", "blue");
        }

        // 매도 내역을 리스트에 추가
        $("#tradeList").append(
            `<tr>
                <td style="font-weight: bold; color: black"><span style="color : blue">매도
                    </span>- 수량: ${parseInt($("#orderQuantity1").val())}개, 
                    단가: ${parseInt($("#currentPrice").data("value")).toLocaleString()}원, 
                    총금액: ${parseInt($("#totalOrderPrice1").data("value")).toLocaleString()}원</td>
            </tr>`
        );

        // "매매내역이 없습니다." 문구 제거
        $("#history").hide();
    });
});