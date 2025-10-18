// Dashboard em tempo real (Gráfico 50/30/20 | Saldo Anual | Estimativa 12 Meses)
(() => {
  const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  const $ = id => document.getElementById(id);

  const nomeUsuarioEl = $('nomeUsuario');
  const salarioEl = $('salario');
  const despesaDiariaEl = $('despesaDiaria');
  const valor50El = $('valor50');
  const valor30El = $('valor30');
  const valor20El = $('valor20');
  const valorAnualEl = $('valorAnual');

  const KEY_USUARIO = 'usuarioLogado';
  const KEY_SALDO = 'saldoAtual';
  const KEY_DESPESA = 'despesaDiaria';

  // --- Inicializar usuário ---
  const emailLogado = localStorage.getItem(KEY_USUARIO);
  if (!emailLogado) {
    alert('Nenhum usuário logado!');
    window.location.href = '/index.html';
    return;
  }
  try {
    const usuario = JSON.parse(localStorage.getItem(emailLogado));
    if (usuario && usuario.nome) nomeUsuarioEl.textContent = usuario.nome;
  } catch (e) {
    console.error('Erro ao carregar usuário:', e);
  }

  // --- Inicializar gráficos ---
  const ctxPizza = $('graficoPizza').getContext('2d');
  let graficoPizza = new Chart(ctxPizza, {
    type: 'pie',
    data: {
      labels: ['Necessidades (50%)', 'Desejos (30%)', 'Prioridades (20%)'],
      datasets: [{
        data: [0, 0, 0],
        backgroundColor: ['#00ffcc', '#00ccff', '#ffaa00'],
        borderColor: '#06102a',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { color: '#fff' } } }
    }
  });

  const ctxInv = $('graficoInvestimento').getContext('2d');
  let graficoInvestimento = new Chart(ctxInv, {
    type: 'line',
    data: {
      labels: Array.from({length:12}, (_,i)=>`Mês ${i+1}`),
      datasets: [{
        label: 'Estimativa de Investimento (R$)',
        data: Array(12).fill(0),
        borderColor: '#00ffcc',
        backgroundColor: 'rgba(0,255,204,0.18)',
        fill: true,
        tension: 0.3
      }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });

  // --- Debounce util ---
  function debounce(fn, wait=200){
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(()=> fn(...args), wait);
    };
  }

  // --- Atualização principal ---
  function updateAllFromInputs(save = true) {
    const salario = parseFloat(salarioEl.value) || 0;
    const despesa = parseFloat(despesaDiariaEl.value) || 0;

    // Calcula 50/30/20
    const v50 = salario * 0.5;
    const v30 = salario * 0.3;
    const v20 = salario * 0.2;

    valor50El.textContent = money(v50);
    valor30El.textContent = money(v30);
    valor20El.textContent = money(v20);

    // Atualiza gráfico pizza
    graficoPizza.data.datasets[0].data = [v50, v30, v20];
    graficoPizza.update();

    // --- Saldo Anual = salário - despesa ---
    const saldo = Math.max(0, salario - despesa);
    valorAnualEl.textContent = money(saldo);

    // Atualiza gráfico de investimento (saldo constante)
    const valoresMensais = Array.from({length:12}, () => saldo);
    graficoInvestimento.data.datasets[0].data = valoresMensais;
    graficoInvestimento.update();

    // Salva no localStorage
    if(save){
      localStorage.setItem(KEY_SALDO, String(salario));
      localStorage.setItem(KEY_DESPESA, String(despesa));
      localStorage.setItem('saldoAtual_updatedAt', new Date().toISOString());
    }
  }

  const debouncedUpdate = debounce(updateAllFromInputs, 300);
  salarioEl.addEventListener('input', () => debouncedUpdate(true));
  despesaDiariaEl.addEventListener('input', () => debouncedUpdate(true));

  // Carregar valores salvos ao abrir
  const savedSaldo = parseFloat(localStorage.getItem(KEY_SALDO));
  const savedDespesa = parseFloat(localStorage.getItem(KEY_DESPESA));
  if(!isNaN(savedSaldo)) salarioEl.value = savedSaldo;
  if(!isNaN(savedDespesa)) despesaDiariaEl.value = savedDespesa;

  // Primeira atualização
  updateAllFromInputs(false);

  // Logout
  window.logout = function() {
    localStorage.removeItem(KEY_USUARIO);
    window.location.href = '/index.html';
  };
})();
