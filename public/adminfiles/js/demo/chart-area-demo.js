let arrForMonth = [];
(function() {
  fetch('/admin_panel/orderData?year='+ new Date().getFullYear(), {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => res.json())
    .then((res) => {
      for(i=1;i<=12;i++){
        for(j=0;j<=12;j++){
          if(res[j]?._id == i){
            arrForMonth[i] = res[j]?.totalCount
            break;
          }else{
            arrForMonth[0]=0
            arrForMonth[i] = 0
          }   
        } 
      }


 
var ctx1 = document.getElementById("myAreaChart").getContext("2d");
    
var gradientStroke1 = ctx1.createLinearGradient(0, 230, 0, 50);

gradientStroke1.addColorStop(1, 'rgba(94, 114, 228, 0.2)');
gradientStroke1.addColorStop(0.2, 'rgba(94, 114, 228, 0.0)');
gradientStroke1.addColorStop(0, 'rgba(94, 114, 228, 0)');
new Chart(ctx1, {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{
      label: "Sales",
      tension: 0.4,
      borderWidth: 0,
      pointRadius: 0,
      borderColor: "#5e72e4",
      backgroundColor: gradientStroke1,
      borderWidth: 3,
      fill: true,
      data: [arrForMonth[1],arrForMonth[2],arrForMonth[3],arrForMonth[4],arrForMonth[5],arrForMonth[6],arrForMonth[7],arrForMonth[8],arrForMonth[9],arrForMonth[10],arrForMonth[11],arrForMonth[12]],
      maxBarThickness: 6

    }],
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      y: {
        grid: {
          drawBorder: false,
          display: true,
          drawOnChartArea: true,
          drawTicks: false,
          borderDash: [5, 5]
        },
        ticks: {
          display: true,
          padding: 10,
          color: '#fbfbfb',
          font: {
            size: 11,
            family: "Open Sans",
            style: 'normal',
            lineHeight: 2
          },
        }
      },
      x: {
        grid: {
          drawBorder: false,
          display: false,
          drawOnChartArea: false,
          drawTicks: false,
          borderDash: [5, 5]
        },
        ticks: {
          display: true,
          color: '#ccc',
          padding: 20,
          font: {
            size: 11,
            family: "Open Sans",
            style: 'normal',
            lineHeight: 2
          },
        }
      },
    },
  },
});
})
}())


