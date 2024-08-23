// ------------------------------------------------ 모달 창 ----------------------------------------------------
$(document).ready(function () {
    // 매수 버튼 클릭 시 매수 모달 보이기
    $("#buyBtn").click(function () {
        $("#buyModal").show();
    });

    // 매도 버튼 클릭 시 매도 모달 보이기
    $("#sellBtn").click(function () {
        $("#sellModal").show();
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
        $("#currentPrice").text(newPrice); // 현재가를 업데이트
        currentPrice = newPrice; // currentPrice 업데이트
        $("#orderPossibility").text((parseInt($("#cash").text()) / currentPrice)); // 매수 가능 코인 수량 업데이트
        $("#orderPrice").text(currentPrice); // 주문 단가 업데이트
        $("#orderPrice1").text(currentPrice);
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
let cash = $("#cash").text(initialAccount);
let coinCount = $("#coinCount").text(0);

$(document).ready(function () {
// ------------------------------------------------ 매수 ------------------------------------------------------
    // 매수 주문가능 코인 수량 업데이트
    $("#orderPossibility").text($("#cash").text() / parseInt($("#currentPrice").text()));

    // 매수 주문 수량 입력 시
    $('#orderQuantity').on('input', function () {
        let orderQuantity = parseInt($(this).val()) || 0; // 수량이 비어있을 경우 0으로 처리

        // 총 매수 주문 금액 업데이트
        $("#totalOrderPrice").text(parseInt($("#currentPrice").text()) * orderQuantity);
    });

    // 매수 10% 계산
    $("#percent1").click(function() {
        $("#orderQuantity").val($("#orderPossibility").text() * 0.1);
        let orderQuantity = parseInt($("#orderQuantity").val());

        // 총 매수 주문 금액 업데이트
        $("#totalOrderPrice").text(parseInt($("#currentPrice").text()) * orderQuantity);
    });

    // 매수 25% 계산
    $("#percent2").click(function() {
        $("#orderQuantity").val($("#orderPossibility").text() * 0.25);
        let orderQuantity = parseInt($("#orderQuantity").val());

        // 총 매수 주문 금액 업데이트
        $("#totalOrderPrice").text(parseInt($("#currentPrice").text()) * orderQuantity);
    });

    // 매수 50% 계산
    $("#percent3").click(function() {
        $("#orderQuantity").val($("#orderPossibility").text() * 0.5);
        let orderQuantity = parseInt($("#orderQuantity").val());

        // 총 매수 주문 금액 업데이트
        $("#totalOrderPrice").text(parseInt($("#currentPrice").text()) * orderQuantity);
    });

    // 매수 100% 계산
    $("#percent4").click(function() {
        $("#orderQuantity").val($("#orderPossibility").text());
        let orderQuantity = parseInt($("#orderQuantity").val());

        // 총 매수 주문 금액 업데이트
        $("#totalOrderPrice").text(parseInt($("#currentPrice").text()) * orderQuantity);
    });

    // 매수 결과
    $("#buy").click(function() {
        $("#buyModal").hide(); //모달창 닫기
        // 보유현금 변화
        let changeCash = $("#cash").text() - $("#totalOrderPrice").text();
        $("#cash").text(changeCash);
        if (changeCash < 0) {
            $("#cash").text(0);
        }
        // 매수 가능 코인 수 변화
        $("#orderPossibility").text($("#cash").text() / parseInt($("#currentPrice").text()));

        //보유 코인 수 변화
        $("#coinCount").text(parseInt($("#coinCount").text()) + parseInt($("#orderQuantity").val()));
        $("#orderPossibility1").text($("#coinCount").text());

        // 코인 평가금액
        $("#coinValue").text(parseInt($("#coinCount").text()) * parseInt($("#currentPrice").text()));

        // 총 평가 자산
        $("#totalValue").text(parseInt($("#cash").text()) + parseInt($("#coinValue").text()));
    });
// ------------------------------------------------ 매도 ----------------------------------------------------
    // 매도 주문가능 코인 수량 업데이트
    $("#orderPossibility1").text($("#coinCount").text());

    // 매도 주문 수량 입력 시
    $('#orderQuantity1').on('input', function () {
        let orderQuantity1 = parseInt($(this).val()) || 0; // 수량이 비어있을 경우 0으로 처리

        // 총 매도 주문 금액 업데이트
        $("#totalOrderPrice1").text(parseInt($("#currentPrice").text()) * orderQuantity1);
    });

    // 매도 10% 계산
    $("#percent10").click(function() {
        $("#orderQuantity1").val($("#orderPossibility1").text() * 0.1);
        let orderQuantity1 = parseInt($("#orderQuantity1").val());

        // 총 매도 주문 금액 업데이트
        $("#totalOrderPrice1").text(parseInt($("#currentPrice").text()) * orderQuantity1);
    });

    // 매도 25% 계산
    $("#percent25").click(function() {
        $("#orderQuantity1").val($("#orderPossibility1").text() * 0.25);
        let orderQuantity = parseInt($("#orderQuantity1").val());

        // 총 매도 주문 금액 업데이트
        $("#totalOrderPrice1").text(parseInt($("#currentPrice").text()) * orderQuantity);
    });

    // 매도 50% 계산
    $("#percent50").click(function() {
        $("#orderQuantity1").val($("#orderPossibility1").text() * 0.5);
        let orderQuantity = parseInt($("#orderQuantity1").val());

        // 총 매도 주문 금액 업데이트
        $("#totalOrderPrice1").text(parseInt($("#currentPrice").text()) * orderQuantity);
    });

    // 매도 100% 계산
    $("#percent100").click(function() {
        $("#orderQuantity1").val($("#orderPossibility1").text());
        let orderQuantity = parseInt($("#orderQuantity1").val());

        // 총 매도 주문 금액 업데이트
        $("#totalOrderPrice1").text(parseInt($("#currentPrice").text()) * orderQuantity);
    });

    // 매도 결과 적용 후 보유 현금
    $("#sell").click(function() {
        $("#sellModal").hide(); // 모달창 닫기
        //보유 현금 변화
        let changeCash = parseInt($("#cash").text()) + parseInt($("#totalOrderPrice1").text());
        $("#cash").text(changeCash);

        // 보유 코인 수 및 매도 가능 코인 수 변화
        $("#coinCount").text(parseInt($("#coinCount").text()) - parseInt($("#orderQuantity1").val()));
        $("#orderPossibility1").text($("#coinCount").text());

        // 코인 평가금액
        $("#coinValue").text(parseInt($("#coinCount").text()) * parseInt($("#currentPrice").text()));

        // 총 평가 자산
        $("#totalValue").text(parseInt($("#cash").text()) + parseInt($("#coinValue").text()));
    });
});