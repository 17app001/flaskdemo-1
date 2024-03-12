// 取得主繪製區域
const chart1 = echarts.init(document.getElementById('main'));
const chart2 = echarts.init(document.getElementById('six'));

$("#update").click(() => {
    console.log("click!");
    drawPM25();
});

// 呼叫後端資料跟繪製
drawPM25();


// 取得後端資料
function drawSixPM25() {
    chart2.showLoading();
    this.setTimeout(() => {
        $.ajax(
            {
                url: "/six-pm25-data",
                type: "POST",
                dataType: "json",
                success: (result) => {
                    //console.log(result);
                    //繪製對應區塊並給予必要參數
                    drawChat(chart2, "六都PM2.5平均值", "PM2.5", result["site"], result["pm25"]);
                    chart2.hideLoading();
                },
                error: () => {
                    alert("讀取資料失敗，請稍後在試");
                    chart2.hideLoading();
                }
            }
        )
    }, 1000);
}

// 取得後端資料
function drawPM25() {
    chart1.showLoading();
    this.setTimeout(() => {
        $.ajax(
            {
                url: "/pm25-data",
                type: "GET",
                dataType: "json",
                success: (result) => {
                    //console.log(result);
                    //繪製對應區塊並給予必要參數

                    $("#pm25_high_site").text(result["highest"]["site"])
                    $("#pm25_high_value").text(result["highest"]["pm25"])
                    $("#pm25_low_site").text(result["lowest"]["site"])
                    $("#pm25_low_value").text(result["lowest"]["pm25"])

                    drawChat(chart1, result["datetime"], "PM2.5", result["site"], result["pm25"]);
                    drawSixPM25();
                    chart1.hideLoading();
                },
                error: () => {
                    alert("讀取資料失敗，請稍後在試");
                    chart1.hideLoading();
                }
            }
        )
    }, 1000);
}

function drawChat(chart, title, legend, xData, yData) {

    let option = {
        title: {
            text: title
        },
        tooltip: {},
        legend: {
            data: [legend]
        },
        xAxis: {
            data: xData
        },
        yAxis: {},
        series: [
            {
                name: legend,
                type: 'bar',
                data: yData
            }
        ]
    };

    chart.setOption(option);
}