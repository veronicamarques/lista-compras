let listaItens = [];
let itemEmEdicao;

const form = document.getElementById('form-itens');
const itensInput = document.getElementById('receber-item');
const listaItensGeral = document.getElementById('lista-de-itens');
const ulItensComprados = document.getElementById('itens-comprados');
const listaRecuperada = localStorage.getItem('listaItens');

function atualizarLocalStorage(){
  localStorage.setItem('listaItens', JSON.stringify(listaItens))
}

if(listaRecuperada){
  listaItens = JSON.parse(listaRecuperada);
  mostrarItens();
}
else{
  listaItens = [];
}

form.addEventListener('submit', function(evento) {
    evento.preventDefault();
    salvarItem();
    mostrarItens();
    itensInput.focus();
  }
)

function salvarItem(){
  const comprasItem = itensInput.value;

  if(listaItens.some((elemento) => elemento.valor.toUpperCase() === comprasItem.toUpperCase())) alert('Item já existe!');
  else{
    listaItens.push(
      {
        valor : comprasItem,
        checar: false
      }
    )
  }

  itensInput.value = '';
}

function mostrarItens(){
  listaItensGeral.innerHTML = '';
  ulItensComprados.innerHTML = '';
  listaItens.forEach((element, index) => {
    if(element.checar){
      ulItensComprados.innerHTML +=`
      <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
        <div>
          <input type="checkbox" checked class="is-clickable" />  
          <span class="itens-comprados is-size-5">${element.valor}</span>
        </div>
        <div>
          <i class="fa-solid fa-trash is-clickable deletar"></i>
        </div>
      </li>`;
    }else{
      listaItensGeral.innerHTML += `
      <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
        <div>
          <input type="checkbox" class="is-clickable" />
          <input type="text" class="is-size-5" value="${element.valor}" ${index != itemEmEdicao ? 'disabled' : ''} />
        </div>
        <div>
          ${index == itemEmEdicao ? '<button onclick="salvarEdicao();"><i class="fa-regular fa-floppy-disk is-clickable"></i></button>' :
          '<i class="fa-regular is-clickable fa-pen-to-square editar" style="margin-left:10px;"></i>'}
          <i class="fa-solid fa-trash is-clickable deletar" style="margin-left:10px;"></i>
        </div>
      </li>`;
    }
  });
  
  const inputsCheck = document.querySelectorAll('input[type="checkbox"]');
  inputsCheck.forEach(i => {
    i.addEventListener('click', (evento) => {
      const valorElemento = evento.target.parentElement.parentElement.getAttribute('data-value');
      listaItens[valorElemento].checar = evento.target.checked;
      mostrarItens();
    })
  })

  const deletarObjetos = document.querySelectorAll('.deletar');
  deletarObjetos.forEach(i => {
    i.addEventListener('click', (evento) => {
      const valorElemento = evento.target.parentElement.parentElement.getAttribute('data-value');
      listaItens.splice(valorElemento,1);
      mostrarItens();
    })
  })

  const editarItens = document.querySelectorAll('.editar');
  editarItens.forEach(i => {
    i.addEventListener('click', (evento) => {
      itemEmEdicao = evento.target.parentElement.parentElement.getAttribute('data-value');
      mostrarItens();
    })
  })

  atualizarLocalStorage();
}

function salvarEdicao(){
  const itemEditado = document.querySelector(`[data-value="${itemEmEdicao}"] input[type="text"]`);
  listaItens[itemEmEdicao].valor = itemEditado.value;
  itemEmEdicao = -1; //como os indices começam em 0, se deixar -1 não vai estar referenciando nenhum objeto.
  mostrarItens();
}
