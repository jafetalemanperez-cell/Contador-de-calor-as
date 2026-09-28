(() => {
  'use strict';
  const KEY='calorie_app_v1';
  const starterFoods=[
    {id:'tortilla',name:'Tortilla de maíz',kcal100:218,pieceG:24},
    {id:'chicken',name:'Pechuga de pollo cocida',kcal100:165},
    {id:'rice',name:'Arroz cocido',kcal100:130},
    {id:'beans',name:'Frijoles cocidos',kcal100:127},
    {id:'egg',name:'Huevo',kcal100:143,pieceG:50},
    {id:'banana',name:'Plátano',kcal100:89,pieceG:118},
    {id:'apple',name:'Manzana',kcal100:52,pieceG:180},
    {id:'avocado',name:'Aguacate',kcal100:160},
    {id:'oil',name:'Aceite vegetal',kcal100:884},
    {id:'potato',name:'Papa cocida',kcal100:87},
    {id:'tomato',name:'Jitomate',kcal100:18},
    {id:'onion',name:'Cebolla',kcal100:40},
    {id:'oats',name:'Avena',kcal100:389},
    {id:'sugar',name:'Azúcar',kcal100:387}
  ];
  const state={profile:null,foods:[...starterFoods],recipes:[],logs:{}};
  const $=id=>document.getElementById(id);
  const todayKey=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
  const today=()=>{const k=todayKey();if(!state.logs[k])state.logs[k]=[];return state.logs[k]};
  const fmt=n=>Math.round(n).toLocaleString('es-MX');
  const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
  function load(){try{const raw=localStorage.getItem(KEY);if(raw){const x=JSON.parse(raw);Object.assign(state,x)}}catch(e){};if(!Array.isArray(state.foods)||!state.foods.length)state.foods=[...starterFoods];if(!state.logs)state.logs={};if(!state.recipes)state.recipes=[]}
  function showView(view){document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));$('view-'+view).classList.remove('hidden');document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.view===view));if(view==='today')renderToday();if(view==='foods')renderFoods();if(view==='recipes')renderRecipes()}
  function calculate(){
    if(!state.profile)return null;const p=state.profile;
    const bmr=10*p.weight+6.25*p.height-5*p.age+(p.sex==='male'?5:-161);const tdee=bmr*p.activity;
    let target=tdee;if(p.goal==='lose')target=tdee*(1-p.deficit);if(p.goal==='gain')target=tdee*1.10;
    return {bmr,tdee,target};
  }
  function renderToday(){
    const r=calculate();const log=today();const consumed=log.reduce((s,x)=>s+x.kcal,0);const target=r?r.target:0;
    $('setupNotice').classList.toggle('hidden',!!r);$('todayTarget').textContent=r?fmt(target)+' kcal':'—';$('todayConsumed').textContent=fmt(consumed)+' kcal';$('todayRemaining').textContent=r?fmt(Math.max(0,target-consumed))+' kcal':'—';$('progressBar').style.width=(r?Math.min(100,(consumed/target)*100):0)+'%';
    const list=$('todayLog');list.innerHTML='';$('emptyToday').classList.toggle('hidden',log.length>0);
    log.forEach((x,i)=>{const el=document.createElement('div');el.className='item';el.innerHTML='<div class="itemMain"><div class="itemName">'+esc(x.name)+'</div><div class="itemMeta">'+esc(x.meal)+' · '+fmt(x.qty)+' g</div></div><div class="itemRight"><div class="kcal">'+fmt(x.kcal)+' kcal</div><button class="delete" type="button" data-del-log="'+i+'" aria-label="Eliminar">×</button></div>';list.appendChild(el)});
  }
  function renderFoods(){
    const q=($('foodSearch').value||'').trim().toLowerCase();const foods=state.foods.filter(f=>f.name.toLowerCase().includes(q));const list=$('foodList');list.innerHTML='';foods.forEach(f=>{const el=document.createElement('div');el.className='item';el.innerHTML='<div class="itemMain"><div class="itemName">'+esc(f.name)+'</div><div class="itemMeta">'+fmt(f.kcal100)+' kcal / 100 g'+(f.pieceG?' · '+f.pieceG+' g por pieza':'')+'</div></div><div class="itemRight"><button class="secondary" type="button" data-use-food="'+esc(f.id)+'">Usar</button></div>';list.appendChild(el)});}
  function renderRecipes(){
    const list=$('recipeList');list.innerHTML='';$('emptyRecipes').classList.toggle('hidden',state.recipes.length>0);state.recipes.forEach(r=>{const el=document.createElement('div');el.className='item';el.innerHTML='<div class="itemMain"><div class="itemName">'+esc(r.name)+'</div><div class="itemMeta">'+r.ingredients.length+' ingredientes · '+r.servings+' porciones</div></div><div class="itemRight"><div class="kcal">'+fmt(r.totalKcal/r.servings)+' kcal</div><div class="itemMeta">por porción</div><button class="delete" type="button" data-del-recipe="'+esc(r.id)+'">Eliminar</button></div>';list.appendChild(el)});}
  function populateFoodSelect(){const s=$('addFoodSelect');s.innerHTML='';state.foods.forEach(f=>{const o=document.createElement('option');o.value=f.id;o.textContent=f.name;s.appendChild(o)});updateAddPreview()}
  function updateAddPreview(){const f=state.foods.find(x=>x.id===$('addFoodSelect').value);const q=Number($('addFoodQty').value)||0;$('addFoodPreview').textContent=f?fmt(f.kcal100*q/100)+' kcal aproximadamente':'—'}
  function openDialog(id){if(id==='addFood'){populateFoodSelect();$('addFoodDialog').showModal()}if(id==='newFood')$('newFoodDialog').showModal();if(id==='newRecipe'){buildIngredientRow();$('newRecipeDialog').showModal()}}
  function closeDialogs(){document.querySelectorAll('dialog[open]').forEach(d=>d.close())}
  function buildIngredientRow(){const row=document.createElement('div');row.className='ingredient';const sel=document.createElement('select');state.foods.forEach(f=>{const o=document.createElement('option');o.value=f.id;o.textContent=f.name;sel.appendChild(o)});const qty=document.createElement('input');qty.type='number';qty.min='0.1';qty.step='0.1';qty.value='100';qty.setAttribute('aria-label','gramos');const del=document.createElement('button');del.type='button';del.textContent='×';del.addEventListener('click',()=>{row.remove();updateRecipeTotal()});[sel,qty].forEach(x=>x.addEventListener('input',updateRecipeTotal));row.append(sel,qty,del);$('ingredientRows').appendChild(row);updateRecipeTotal()}
  function updateRecipeTotal(){let total=0;document.querySelectorAll('#ingredientRows .ingredient').forEach(row=>{const f=state.foods.find(x=>x.id===row.children[0].value);const q=Number(row.children[1].value)||0;if(f)total+=f.kcal100*q/100});$('recipeTotal').textContent=fmt(total)+' kcal totales'}
  function esc(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

  document.addEventListener('click',e=>{
    const tab=e.target.closest('.tab');if(tab){showView(tab.dataset.view);return}
    const go=e.target.closest('[data-go]');if(go){showView(go.dataset.go);return}
    const op=e.target.closest('[data-open]');if(op){openDialog(op.dataset.open);return}
    if(e.target.matches('[data-close]')){closeDialogs();return}
    const dl=e.target.closest('[data-del-log]');if(dl){today().splice(Number(dl.dataset.delLog),1);save();renderToday();return}
    const df=e.target.closest('[data-use-food]');if(df){showView('today');populateFoodSelect();$('addFoodSelect').value=df.dataset.useFood;$('addFoodQty').value=100;updateAddPreview();$('addFoodDialog').showModal();return}
    const dr=e.target.closest('[data-del-recipe]');if(dr){state.recipes=state.recipes.filter(r=>r.id!==dr.dataset.delRecipe);save();renderRecipes();return}
  });
  $('profileForm').addEventListener('submit',e=>{e.preventDefault();const p={age:Number($('age').value),sex:$('sex').value,weight:Number($('weight').value),height:Number($('height').value),activity:Number($('activity').value),goal:$('goal').value,deficit:Number($('deficit').value)};const ok=Number.isFinite(p.age)&&Number.isFinite(p.weight)&&Number.isFinite(p.height)&&p.age>=15&&p.age<=100&&p.weight>=35&&p.weight<=300&&p.height>=120&&p.height<=230;if(!ok){$('profileError').textContent='Revisa edad, peso y estatura.';return}state.profile=p;save();$('profileError').textContent='';renderCalculator();renderToday()});
  $('goal').addEventListener('change',()=>{$('deficitLabel').style.display=$('goal').value==='lose'?'flex':'none'});
  $('foodSearch').addEventListener('input',renderFoods);
  $('addFoodSelect').addEventListener('change',updateAddPreview);$('addFoodQty').addEventListener('input',updateAddPreview);
  $('addFoodForm').addEventListener('submit',e=>{e.preventDefault();const f=state.foods.find(x=>x.id===$('addFoodSelect').value);const qty=Number($('addFoodQty').value);if(!f||!qty||qty<=0)return;today().push({id:uid(),name:f.name,qty,meal:$('addMeal').value,kcal:f.kcal100*qty/100});save();$('addFoodDialog').close();renderToday()});
  $('newFoodForm').addEventListener('submit',e=>{e.preventDefault();const name=$('newFoodName').value.trim(),k=Number($('newFoodKcal').value),piece=Number($('newFoodPiece').value)||0;if(!name||!Number.isFinite(k)||k<0)return;state.foods.push({id:uid(),name,kcal100:k,pieceG:piece||null});save();$('newFoodForm').reset();$('newFoodDialog').close();renderFoods()});
  $('addIngredient').addEventListener('click',buildIngredientRow);
  $('newRecipeForm').addEventListener('submit',e=>{e.preventDefault();const name=$('recipeName').value.trim(),servings=Math.max(1,Number($('recipeServings').value)||1);const ingredients=[];let total=0;document.querySelectorAll('#ingredientRows .ingredient').forEach(row=>{const f=state.foods.find(x=>x.id===row.children[0].value),qty=Number(row.children[1].value)||0;if(f&&qty>0){ingredients.push({foodId:f.id,qty});total+=f.kcal100*qty/100}});if(!name||!ingredients.length)return;state.recipes.push({id:uid(),name,servings,totalKcal:total,ingredients});save();$('newRecipeDialog').close();$('newRecipeForm').reset();$('ingredientRows').innerHTML='';$('recipeTotal').textContent='0 kcal totales';renderRecipes()});
  function renderCalculator(){const p=state.profile;if(!p)return;['age','sex','weight','height','activity','goal','deficit'].forEach(id=>$(id).value=p[id]);$('deficitLabel').style.display=p.goal==='lose'?'flex':'none';const r=calculate();$('bmr').textContent=fmt(r.bmr)+' kcal';$('tdee').textContent=fmt(r.tdee)+' kcal';$('target').textContent=fmt(r.target)+' kcal';$('calcText').textContent=p.goal==='lose'?'Meta calculada con un déficit del '+Math.round(p.deficit*100)+'% sobre mantenimiento.':'Meta calculada según el objetivo seleccionado.';$('calcResults').classList.remove('hidden')}
  load();renderCalculator();renderToday();showView('today');
})();
