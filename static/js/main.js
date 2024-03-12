// 取得主繪製區域
const chart1 = echarts.init(document.getElementById('main'));
const chart2 = echarts.init(document.getElementById('six'));
const chart3 = echarts.init(document.getElementById('county'));

$("#update").click(() => {
    drawPM25();
});

$("#select_county").change(() => {
    let county = $("#select_county").val();
    drawCountyPM25(county);
});

// 呼叫後端函式跟繪製
$(document).ready(() => {
    drawPM25();
});

function drawCountyPM25(county) {
    chart3.showLoading();
    this.setTimeout(() => {
        $.ajax(
            {
                url: `/county-pm25-data/${county}`,
                type: "GET",
                dataType: "json",
                success: (result) => {
                    //console.log(result);
                    //繪製對應區塊並給予必要參數
                    drawChat(chart3, county, "PM2.5", result["site"], result["pm25"], "darkorchid");
                    chart3.hideLoading();
                },
                error: () => {
                    alert("讀取資料失敗，請稍後在試");
                    chart3.hideLoading();
                }
            }
        )
    }, 1000);
}


// 取得後端API
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
                    drawChat(chart2, "六都PM2.5平均值", "PM2.5", result["site"], result["pm25"], "darkseagreen");
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
                    drawCountyPM25("臺北市");
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

function drawChat(chart, title, legend, xData, yData, color = "#f5deb3") {
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
                data: yData,
                // 在這裡指定顏色
                itemStyle: {
                    color: color  // 你可以使用任何你想要的顏色
                }
            }
        ]
    };

    chart.setOption(option);
}