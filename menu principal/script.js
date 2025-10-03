// Gráfico de pizza
let ctx = document.getElementById("graficoPizza").getContext("2d");
let graficoPizza = new Chart(ctx, {
  type: "pie",
  data: {
    labels: ["Necessidades (50%)","Desejos (30%)","Prioridades (20%)"],
    datasets:[{
      data:[0,0,0],
      backgroundColor:["#ff4d4d","#ffcc00","#00cc66"],
      borderWidth:1
    }]
  },
  options: { responsive:true, plugins:{ legend:{position:"bottom"} } }
});

function calcular(){
  let salario = parseFloat(document.getElementById("salario").value);
  if(!salario || salario <=0){ alert("Digite um salário válido!"); return; }

  let valor50 = salario*0.5;
  let valor30 = salario*0.3;
  let valor20 = salario*0.2;

  document.getElementById("valor50").innerText = "R$ "+valor50.toFixed(2);
  document.getElementById("valor30").innerText = "R$ "+valor30.toFixed(2);
  document.getElementById("valor20").innerText = "R$ "+valor20.toFixed(2);

  graficoPizza.data.datasets[0].data = [valor50, valor30, valor20];
  graficoPizza.update();
}
