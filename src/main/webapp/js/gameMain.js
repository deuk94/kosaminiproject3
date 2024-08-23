// ------------------------------------------------ 모달 창 ----------------------------------------------------
$(document).ready(function () {
    // 매수 버튼 클릭 시 매수 모달 보이기
    $("#buyBtn").click(function () {
        $("#buyModal").show();
        $("#orderQuantity").val(0);
    });

    // 매도 버튼 클릭 시 매도 모달 보이기
    $("#sellBtn").click(function () {
        $("#sellModal").show();
        $("#orderQuantity").val(0);
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

    // 다음 버튼(test용)
    $("#nextBtn").click(function() {
        let msm = prompt("금액을 입력하세요");
        let newPrice = parseInt(msm);
        $("#currentPrice").data('value',newPrice);
        $("#currentPrice").text(newPrice.toLocaleString()); // 현재가를 업데이트
        currentPrice = newPrice; // currentPrice 업데이트

        $("#orderPrice").data('value',currentPrice);
        $("#orderPrice").text(currentPrice.toLocaleString()); // 주문 단가 업데이트
        $("#orderPrice1").data('value',currentPrice);
        $("#orderPrice1").text(currentPrice.toLocaleString());
        // 매수 가능 코인 수량 업데이트
        // 수정 사항 - 주문 가능 코인 내림 처리
        $("#orderPossibility").data('value',
            Math.floor(parseFloat($("#cash").data('value')) / parseFloat($("#currentPrice").data('value')))
        );
        $("#orderPossibility").text(
            Math.floor(parseFloat($("#cash").data('value')) / parseFloat($("#currentPrice").data('value'))).toLocaleString()
        );
    });
});

$(document).on("click", function (event) {
    // 매수 모달 바깥 영역 클릭 시 모달 닫기
    if ($(event.target).is("#buyModal")) {
        $("#buyModal").hide();
    }
    // 매도 모달 바깥 영역 클릭 시 모달 닫기
    if ($(event.target).is("#sellModal")) {
        $("#sellModal").hide();
    }
});

// ------------------------------------------------ 기능구현 ----------------------------------------------------

let initialAccount = 10000000; // 초기 자산
$("#cash").data('value',initialAccount); // 초기 보유
$("#cash").text(initialAccount.toLocaleString());
let coinCount = 0;
$("#coinCount").data('value',coinCount);
$("#coinCount").text(coinCount);

$(document).ready(function () {

// ------------------------------------------------ 매수 ------------------------------------------------------

    // 매수 주문가능 코인 수량 업데이트
    // 수정 사항 - 주문 가능 코인 내림 처리
    $("#orderPossibility").data('value',
        Math.floor(parseFloat($("#cash").data('value')) / parseFloat($("#currentPrice").text()))
    );
    $("#orderPossibility").text(
        Math.floor(parseFloat($("#cash").data('value')) / parseFloat($("#currentPrice").text())).toLocaleString()
    );

    // 매수 주문 수량 입력 시
    // 수정 사항 - 매수시 기존 수량 넘어갈 시, 음수 입력시 다시 입력
    $('#orderQuantity').on('input', function () {
        let orderQuantity = parseInt($(this).val()) || 0; // 수량이 비어있을 경우 0으로 처리
        let orderPossibility = parseInt($("#orderPossibility").data('value')); // 가능 수량
        if (orderQuantity > orderPossibility) {
            alert("입력한 주문 수량이 최대 가능 수량을 초과했습니다. 다시 입력해주세요.");
            $(this).val(''); // 입력 필드를 비웁니다
        }else if (orderQuantity < 0) {
            alert("주문 수량은 0보다 작을 수 없습니다. 다시 입력해주세요.");
            $(this).val(''); // 입력 필드를 비웁니다
        } else {
            // 총 매수 주문 금액 업데이트
            let totalOrderPrice = parseInt($("#currentPrice").text()) * orderQuantity;

            // 금액을 계산된 숫자로 저장해두고, 별도의 데이터 속성에 유지
            $("#totalOrderPrice").data('value', totalOrderPrice);

            // 쉼표를 추가하여 표시
            $("#totalOrderPrice").text(totalOrderPrice.toLocaleString());
        }
    });

    // 매수 10% 계산
    // 수정 사항 - 주문 가능 코인 내림 처리
    $("#percent1").click(function() {
        $("#orderQuantity").val(Math.floor($("#orderPossibility").data('value') * 0.1));
        let totalOrderPrice = parseInt($("#currentPrice").data('value')) * parseInt($("#orderQuantity").val());
        $("#totalOrderPrice").data('value',totalOrderPrice);
        // 총 매수 주문 금액 업데이트
        $("#totalOrderPrice").text(totalOrderPrice.toLocaleString());
    })

    // 매수 25% 계산
    // 수정 사항 - 주문 가능 코인 내림 처리
    $("#percent2").click(function() {
        $("#orderQuantity").val(Math.floor($("#orderPossibility").data('value') * 0.25));
        let totalOrderPrice = parseInt($("#currentPrice").data('value')) * parseInt($("#orderQuantity").val());
        $("#totalOrderPrice").data('value',totalOrderPrice);
        // 총 매수 주문 금액 업데이트
        $("#totalOrderPrice").text(totalOrderPrice.toLocaleString());
    });

    // 매수 50% 계산
    // 수정 사항 - 주문 가능 코인 내림 처리
    $("#percent3").click(function() {
        $("#orderQuantity").val(Math.floor($("#orderPossibility").data('value')* 0.5));
        let totalOrderPrice = parseInt($("#currentPrice").data('value')) * parseInt($("#orderQuantity").val());
        $("#totalOrderPrice").data('value',totalOrderPrice);
        // 총 매수 주문 금액 업데이트
        $("#totalOrderPrice").text(totalOrderPrice.toLocaleString());
    });

    // 매수 100% 계산
    // 수정 사항 - 주문 가능 코인 내림 처리
    $("#percent4").click(function() {
        $("#orderQuantity").val(Math.floor($("#orderPossibility").data('value')));
        let totalOrderPrice = parseInt($("#currentPrice").data('value')) * parseInt($("#orderQuantity").val());
        $("#totalOrderPrice").data('value',totalOrderPrice);
        // 총 매수 주문 금액 업데이트
        $("#totalOrderPrice").text(totalOrderPrice.toLocaleString());
    });

    // 매수 결과
    $("#buy").click(function() {
        $("#buyModal").hide(); //모달창 닫기
        // 보유현금 변화
        let changeCash = $("#cash").data('value') - $("#totalOrderPrice").data('value');
        $("#cash").text(changeCash.toLocaleString());
        $("#cash").data('value',changeCash);
        if (changeCash < 0) {
            $("#cash").text(0);
        }
        // 매수 가능 코인 수 변화
        let orderPossibility = Math.floor(parseFloat($("#cash").data('value')) / parseFloat($("#currentPrice").text()));
        $("#orderPossibility").data('value', orderPossibility);
        $("#orderPossibility").text(orderPossibility.toLocaleString());

        //보유 코인 수 변화
        let coinCount = parseInt($("#coinCount").data('value')) + parseInt($("#orderQuantity").val());
        $("#coinCount").data('value',coinCount);
        $("#coinCount").text(coinCount.toLocaleString());
        $("#orderPossibility1").data('value',$("#coinCount").data('value'));
        $("#orderPossibility1").text($("#coinCount").data('value').toLocaleString());

        // 코인 평가금액
        let coinValue = parseInt($("#coinCount").data('value')) * parseInt($("#currentPrice").data('value'));
        $("#coinValue").data('value',coinValue);
        $("#coinValue").text(coinValue.toLocaleString());

        // 총 평가 자산
        let totalValue = parseInt($("#cash").data('value')) + parseInt($("#coinValue").data('value'));
        $("#totalValue").data('value',totalValue);
        $("#totalValue").text(totalValue.toLocaleString());


        // 평단가
        let averagePrice = parseInt($("#coinValue").data('value')) / parseInt($("#coinCount").data('value'));
        $("#averagePrice").data('value',averagePrice);
        $("#averagePrice").text(averagePrice.toLocaleString());

        // 수익률
        let ROI = ((parseInt($("#totalValue").data('value')) - parseInt(initialAccount)) / parseInt(initialAccount) * 100);
        ROI = Math.round(ROI * 100) / 100; // 소수점 세째자리 표시
        $("#changePercent").text(ROI + "%");
        $("#ROI").text(ROI + "%");
        // 수익률에 따른 색 변화
        if (ROI > 0) {
            $("#changePercent").css("color", "red");
            $("#ROI").css("color", "red");
        } else {
            $("#changePercent").css("color", "blue");
            $("#ROI").css("color", "blue");
        }

        // 매매 내역을 리스트에 추가
        $("#tradeList").append(
            `<tr>
                <td style="font-weight: bold; color: black"><span style="color : red">매수</span>- 수량: ${parseInt($("#orderQuantity").val())}개, 
                    단가: ${(parseInt($("#currentPrice").data('value'))).toLocaleString()}원,
                    총금액: ${(parseInt($("#totalOrderPrice").data('value'))).toLocaleString()}원</td>
            </tr>`
        );

        // "매매내역이 없습니다." 문구 제거
        $("#history").hide();
    });

// ------------------------------------------------ 매도 ----------------------------------------------------
    // 매도 주문가능 코인 수량 업데이트
    // $("#orderPossibility1").data('value',$("#coinCount").data('value'));
    // $("#orderPossibility1").text((parseInt($("#coinCount").data('value'))).toLocaleString());

    // 매도 주문 수량 입력 시
    // 수정 사항 - 매도시 기존 수량 넘어갈 시, 음수 입력시 다시 입력
    $('#orderQuantity1').on('input', function () {
        let orderQuantity1 = parseInt($(this).val()) || 0; // 수량이 비어있을 경우 0으로 처리
        let orderPossibility1 = parseInt($("#orderPossibility1").data('value')); // 가능 수량
        if (orderQuantity1 > orderPossibility1) {
            alert("입력한 주문 수량이 최대 가능 수량을 초과했습니다. 다시 입력해주세요.");
            $(this).val(''); // 입력 필드를 비웁니다
        }else if (orderQuantity1 < 0) {
            alert("주문 수량은 0보다 작을 수 없습니다. 다시 입력해주세요.");
            $(this).val(''); // 입력 필드를 비웁니다
        }
        else {
            // 총 매수 주문 금액 업데이트
            $("#totalOrderPrice1").data('value',parseInt($("#currentPrice").data('value')) * orderQuantity1);
            $("#totalOrderPrice1").text((parseInt($("#currentPrice").data('value')) * orderQuantity1).toLocaleString());
        }
    });

    // 매도 10% 계산
    //수정 사항 - 매도시 코인 수량 내림처리
    $("#percent10").click(function() {
        $("#orderQuantity1").val(Math.floor($("#orderPossibility1").data('value') * 0.1));
        let totalOrderPrice = parseInt($("#currentPrice").data('value')) * parseInt($("#orderQuantity1").val());
        $("#totalOrderPrice1").data('value',totalOrderPrice);
        // 총 매수 주문 금액 업데이트
        $("#totalOrderPrice1").text(totalOrderPrice.toLocaleString());
    });

    // 매도 25% 계산
    //수정 사항 - 매도시 코인 수량 내림처리
    $("#percent25").click(function() {
        $("#orderQuantity1").val(Math.floor($("#orderPossibility1").data('value') * 0.25));
        let totalOrderPrice = parseInt($("#currentPrice").data('value')) * parseInt($("#orderQuantity1").val());
        $("#totalOrderPrice1").data('value',totalOrderPrice);
        // 총 매수 주문 금액 업데이트
        $("#totalOrderPrice1").text(totalOrderPrice.toLocaleString());
    });

    // 매도 50% 계산
    //수정 사항 - 매도시 코인 수량 내림처리
    $("#percent50").click(function() {
        $("#orderQuantity1").val(Math.floor($("#orderPossibility1").data('value') * 0.5));
        let totalOrderPrice = parseInt($("#currentPrice").data('value')) * parseInt($("#orderQuantity1").val());
        $("#totalOrderPrice1").data('value',totalOrderPrice);
        // 총 매수 주문 금액 업데이트
        $("#totalOrderPrice1").text(totalOrderPrice.toLocaleString());
    });

    // 매도 100% 계산
    //수정 사항 - 매도시 코인 수량 내림처리
    $("#percent100").click(function() {
        $("#orderQuantity1").val(Math.floor($("#orderPossibility1").data('value')));
        let totalOrderPrice = parseInt($("#currentPrice").data('value')) * parseInt($("#orderQuantity1").val());
        $("#totalOrderPrice1").data('value',totalOrderPrice);
        // 총 매수 주문 금액 업데이트
        $("#totalOrderPrice1").text(totalOrderPrice.toLocaleString());
    });

    // 매도 결과 적용 후 보유 현금
    $("#sell").click(function() {
        $("#sellModal").hide(); // 모달창 닫기
        //보유 현금 변화
        let changeCash = parseInt($("#cash").data('value')) + parseInt($("#totalOrderPrice1").data('value'));
        $("#cash").data('value',changeCash);
        $("#cash").text(changeCash.toLocaleString());

        // 보유 코인 수 및 매도 가능 코인 수 변화
        let coinCount = parseInt($("#coinCount").data('value')) - parseInt($("#orderQuantity1").val());
        $("#coinCount").data('value', coinCount);
        $("#coinCount").text(coinCount.toLocaleString());
        $("#orderPossibility1").data('value',$("#coinCount").data('value'));
        $("#orderPossibility1").text($("#coinCount").data('value').toLocaleString());

        // 코인 평가금액
        let coinValue = parseInt($("#coinCount").data('value')) * parseInt($("#currentPrice").data('value'));
        $("#coinValue").data('value',coinValue);
        $("#coinValue").text(coinValue.toLocaleString());

        // 총 평가 자산
        let totalValue = parseInt($("#cash").data('value')) + parseInt($("#coinValue").data('value'));
        $("#totalValue").data('value', totalValue);
        $("#totalValue").text(totalValue.toLocaleString());

        // 수익률
        let ROI = ((parseInt($("#totalValue").data('value')) - parseInt(initialAccount)) / parseInt(initialAccount) * 100);
        ROI = Math.round(ROI * 100) / 100; // 소수점 세째자리 표시
        $("#changePercent").text(ROI + "%");
        $("#ROI").text(ROI + "%");

        // 수익률에 따른 색 변화
        if (ROI > 0) {
            $("#changePercent").css("color", "red");
            $("#ROI").css("color", "red");
        } else {
            $("#changePercent").css("color", "blue");
            $("#ROI").css("color", "blue");
        }

        // 매도 내역을 리스트에 추가
        $("#tradeList").append(
            `<tr>
                <td style="font-weight: bold; color: black"><span style="color : blue">매도</span>- 수량: ${parseInt($("#orderQuantity1").val())}개, 
                    단가: ${parseInt($("#currentPrice").data('value')).toLocaleString()}원, 
                    총금액: ${parseInt($("#totalOrderPrice1").data('value')).toLocaleString()}원</td>
            </tr>`
        );

        // "매매내역이 없습니다." 문구 제거
        $("#history").hide();
    });
});