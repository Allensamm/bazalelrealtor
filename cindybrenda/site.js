const menuButton=document.querySelector('.menu-button');
const nav=document.querySelector('.nav');
if(menuButton&&nav)menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close menu':'Open menu')});
const query = new URLSearchParams(window.location.search);
const search = document.querySelector('#homeSearch');
const statusSelect = document.querySelector('#statusFilter');
if (search && statusSelect) {
  const cards = Array.from(document.querySelectorAll('#propertyGrid .property-card'));
  const empty = document.querySelector('#emptyDirectory');
  const areaContact = document.querySelector('#areaContact');
  function updateDirectory() {
    const term = search.value.trim().toLowerCase();
    let count = 0;
    for (const card of cards) {
      const matchesStatus = statusSelect.value === 'all' || card.dataset.status === statusSelect.value;
      const matchesTerm = card.textContent.toLowerCase().includes(term);
      card.hidden = !(matchesStatus && matchesTerm);
      if (!card.hidden) count++;
    }
    empty.hidden = count > 0;
    areaContact.href = 'contact.html?area=' + encodeURIComponent(search.value.trim());
  }
  search.value = query.get('q') || '';
  search.addEventListener('input', updateDirectory);
  statusSelect.addEventListener('change', updateDirectory);
  updateDirectory();
}

const message = document.querySelector('#message');
if (message && !message.value) {
  if (query.has('home')) message.value = 'I would like more information about ' + query.get('home') + '.';
  else if (query.has('area')) message.value = 'I am looking for homes in ' + query.get('area') + '.';
}

document.querySelectorAll('[data-mailto-form]').forEach(form=>form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const fields=new FormData(form);const body=[...fields.entries()].map(([key,value])=>`${key}: ${value}`).join('\n');const subject=encodeURIComponent(form.dataset.subject||'House of CB inquiry');window.location.href=`mailto:CindyOtten@yahoo.com?subject=${subject}&body=${encodeURIComponent(body)}`}));
const mortgageForm=document.querySelector('#mortgageForm');
if(mortgageForm){const update=()=>{const price=Number(document.querySelector('#price').value)||0;const down=Number(document.querySelector('#down').value)||0;const rate=(Number(document.querySelector('#rate').value)||0)/1200;const months=(Number(document.querySelector('#term').value)||30)*12;const loan=Math.max(0,price-down);const monthly=rate?loan*rate/(1-Math.pow(1+rate,-months)):loan/months;const money=value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);document.querySelector('#paymentResult').textContent=money(monthly);document.querySelector('#loanAmount').textContent=money(loan);document.querySelector('#totalPaid').textContent=money(monthly*months)};mortgageForm.addEventListener('input',update);mortgageForm.addEventListener('change',update);update()}
