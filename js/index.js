var eJson;
fetch('/enemy/static/data/enemy_alldata.json')
	.then(response => response.json())
	.then(data => {
		eJson = data;
	
	let enemyInput = document.querySelector('input');
	var searchVal = '';
	var filterArr = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
	// normal elite boss inf drone sark poss seamons creat melee ranged doesn'tatk phys arts healing

	for(var i = 0; i < eJson.length; i++) {
		const enDiv = document.getElementById("enemyWidget");
		const cnDiv = document.getElementById("enemyWidget_CN");
		name = eJson[i].name;
		source = eJson[i].address;
		caption = eJson[i].index;
		ref = eJson[i].name.replaceAll(' ', '_');
		img = `<a href="#${ref}"><div class="enemyCard" id="#${eJson[i].code}" name="${name}"><figure><img src= ${source} style="width: 80px; height: 80px;"><figcaption>${caption}</figcaption></figure></div></a>`;
		if(eJson[i].server == 'EN') { enDiv.insertAdjacentHTML('beforeend', img); }
		else { cnDiv.insertAdjacentHTML('beforeend', img); }
	}

	enemyInput.oninput = handleSearch;

	const lightBox = document.createElement('div');
	lightBox.id = 'lightBox';
	document.getElementById('mainDiv').appendChild(lightBox);

	lightBox.addEventListener('click', e => {
		if(e.target != e.currentTarget) return;
		lightBox.classList.remove('active');
		document.body.style.overflow = 'visible';
	})

	function addBoxToCard() {
		const enemySelect = document.querySelectorAll(".enemyCard");
		enemySelect.forEach(card => {
			card.addEventListener('click', e => {
				lightBox.classList.add('active');
				const infoBox = document.createElement('div');
				var tempData;

				for(var i = 0; i < eJson.length; i++) {
					if(eJson[i].name == card.getAttribute('name')) { 
						tempData = eJson[i];
						break;
					}
				}

				infoBox.id = 'infoBox';
				$('title').text(tempData.name);
				$('meta[name=description]').attr('content', tempData.name);
				$('meta[property="og:image"]').attr('content', "static/assets/enemies/" + tempData.code + ".png");
				
				htmlText = `<span class="display-6" style="font-size:35px;">${tempData.name}</span>
					<span id="closeBox" class="display-6 closeBox" style="font-size:35px; float:right; position:sticky; position: -webkit-sticky; top:0; cursor: pointer;">×</span>
					<hr/>
					<div style="display:flex; align-items:center;">
						<figure style="margin-right: 20px;">
							<img src="${tempData.address}" style="width: 100px; height: 100px;">
							<figcaption>${tempData.index}</figcaption>
						</figure>`;

				if(tempData.race == '') {
					htmlText = htmlText.concat(`<p><strong>Level: </strong>${tempData.level}<br><strong>Attack Type: </strong>${tempData.atktype}<br><strong>Damage Type: </strong>${tempData.atkattri}</p></div>`);
				}
				else {
					htmlText = htmlText.concat(`<p><strong>Level: </strong>${tempData.level}<br><strong>Race: </strong>${tempData.race}<br><strong>Attack Type: </strong>${tempData.atktype}<br><strong>Damage Type: </strong>${tempData.atkattri}</p></div>`);
				}

				htmlText = htmlText.concat(`
					<div style="display:flex; align-items:center; justify-content:left; gap:20px; margin-bottom: 18px;">
						<div style="width:70px; height:70px; border: #3e3e3e solid; text-align:center; line-height:70px; position: relative;">
							<img src="/enemy/static/assets/hp.png" style="width: 21px; height: 21px; top:0; left:0; position: absolute; border-bottom: #3e3e3e solid; border-right: #3e3e3e solid">
							<h3 style="margin-top:18px;">${tempData.endure}</h3>
						</div>
						<div style="width:70px; height:70px; border: #3e3e3e solid; text-align:center; line-height:70px; position: relative;">
							<img src="/enemy/static/assets/atk.png" style="width: 21px; hheight: 21px; top:0; left:0; position: absolute; border-bottom: #3e3e3e solid; border-right: #3e3e3e solid">
							<h3 style="margin-top:18px;">${tempData.attack}</h3>
						</div>
						<div style="width:70px; height:70px; border: #3e3e3e solid; text-align:center; line-height:70px; position: relative;">
							<img src="/enemy/static/assets/defense.png" style="width: 21px; height: 21px; top:0; left:0; position: absolute; border-bottom: #3e3e3e solid; border-right: #3e3e3e solid">
							<h3 style="margin-top:18px;">${tempData.defence}</h3>
						</div>
						<div style="width:70px; height:70px; border: #3e3e3e solid; text-align:center; line-height:70px; position: relative;">
							<img src="/enemy/static/assets/resistance.png" style="width: 21px; height: 21px; top:0; left:0; position: absolute; border-bottom: #3e3e3e solid; border-right: #3e3e3e solid">
							<h3 style="margin-top:18px;">${tempData.resistance}</h3>
						</div>
					</div>
					<span class="display-6" style="font-size:25px;">Description</span>
					<hr style="margin-bottom:5px; margin-top:5px;"/>
					<p>${tempData.description}</p>
					<span class="display-6" style="font-size:25px;">Ability</span>
					<hr style="margin-bottom:5px; margin-top:5px;"/>
					<p>${tempData.ability}</p>`)

				for(var i = 0; i < tempData.statlevels; i++) {
					var level = "Level ";
					level = level.concat(i.toString());

					htmlText = htmlText.concat(`
						<span class="display-6" style="font-size:25px;">${level}</span>
						<hr style="margin-bottom:5px; margin-top:5px;"/>
						<table class="table table-sm table-bordered" style="text-align: center; table-layout: fixed;">
							<thead class="thead-light">
								<tr style="background-color: #dbdbdb;">
									<th scope="col" style="text-overflow: ellipsis; overflow: hidden;">HP</th>
									<th scope="col" style="text-overflow: ellipsis; overflow: hidden;">Attack</th>
									<th scope="col" style="text-overflow: ellipsis; overflow: hidden;">Defense</th>
									<th scope="col" style="text-overflow: ellipsis; overflow: hidden;">Resistance</th>
									<th scope="col" style="text-overflow: ellipsis; overflow: hidden;">HP Seals</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>${tempData.lhp[i]}</td>
									<td>${tempData.latk[i]}</td>
									<td>${tempData.ldef[i]}</td>
									<td>${tempData.lres[i]}</td>
									<td>${tempData.lseal[i]}</td>
								</tr>
							</tbody>
							<thead class="thead-light">
								<tr style="background-color: #dbdbdb;">
									<th scope="col" style="text-overflow: ellipsis; overflow: hidden;">ATK Interval</th>
									<th scope="col" style="text-overflow: ellipsis; overflow: hidden;">ATK Range</th>
									<th scope="col" style="text-overflow: ellipsis; overflow: hidden;">Speed</th>
									<th scope="col" style="text-overflow: ellipsis; overflow: hidden;">Weight</th>
									<th scope="col" style="text-overflow: ellipsis; overflow: hidden;">HP Regen</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>${tempData.latkint[i]}</td>
									<td>${tempData.lrange[i]}</td>
									<td>${tempData.lmvspd[i]}</td>
									<td>${tempData.lweight[i]}</td>
									<td>${tempData.lregen[i]}</td>
								</tr>
							</tbody>
						</table>
					`)
				}

				htmlText = htmlText.concat(`
					<span class="display-6" style="font-size:25px;">Immunity</span>
					<hr style="margin-bottom:5px; margin-top:5px;"/>
					<p>${tempData.immunity}</p>
					<span class="display-6" style="font-size:25px;">Talents</span>
					<hr style="margin-bottom:5px; margin-top:5px;"/>
					<p>${tempData.talent}</p>
					<span class="display-6" style="font-size:25px;">Skills</span>
					<hr style="margin-bottom:5px; margin-top:5px;"/>`)

				if(tempData.skill == 'None') {
					htmlText = htmlText.concat(`<p>None</p>`);
				}
				else {
					htmlText = htmlText.concat(`
						<table class="table table-sm table-bordered" style="text-align: center;">
							<thead class="thead-light">
								<tr style="background-color: #dbdbdb;">
									<th scope="col">Name</th>
									<th scope="col">Initial</th>
									<th scope="col">Cost</th>
									<th scope="col">Type</th>
									<th scope="col">Effect</th>
								</tr>
							</thead>`);

					for(var j = 0; j < tempData.skillnum; j++) {
						htmlText = htmlText.concat(`
							<tbody>
								<tr>
									<td>${tempData.skill[j].name}</td>
									<td>${tempData.skill[j].initial}</td>
									<td>${tempData.skill[j].cost}</td>
									<td>${tempData.skill[j].type}</td>
									<td>${tempData.skill[j].effect}</td>
								</tr>
							</tbody>`);
					}

					htmlText = htmlText.concat(`</table>`);
				}
								
				infoBox.innerHTML = htmlText;
				while(lightBox.firstChild) { lightBox.removeChild(lightBox.firstChild); }
				lightBox.appendChild(infoBox);
				document.body.style.overflow = 'hidden';
			});
		});
	}

	addBoxToCard();

	function deleteChildren(parent) {
		while(parent.firstChild) {
			parent.removeChild(parent.firstChild);
		}
	}

	function filterData(data) {
		var filtered = true;
		for(var i = 0; i < filterArr.length; i++) {
			if(filterArr[i] == 1) {
				if(i == 0) {
					if(data.level != 'Normal') { filtered = false; break; }
				}
				if(i == 1) {
					if(data.level != 'Elite') { filtered = false; break; }
				}
				if(i == 2) {
					if(data.level != 'Boss') { filtered = false; break; }
				}
				if(i == 3) {
					if(data.race != 'Infected Creature' && data.race != '感染生物') { filtered = false; break; }
				}
				if(i == 4) {
					if(data.race != 'Drone' && data.race != '无人机') { filtered = false; break; }
				}
				if(i == 5) {
					if(data.race != 'Sarkaz' && data.race != '萨卡兹') { filtered = false; break; }
				}
				if(i == 6) {
					if(data.race != 'Possessed' && data.race != '宿主') { filtered = false; break; }
				}
				if(i == 7) {
					if(data.race != 'Sea Monster' && data.race != '海怪') { filtered = false; break; }
				}
				if(i == 8) {
					if(data.race != 'Arts Creation' && data.race != '法术造物') { filtered = false; break; }
				}
				if(i == 9) {
					if(data.atktype.includes('Melee') != true && data.atktype.includes('近战') != true) { filtered = false; break; }
				}
				if(i == 10) {
					if(data.atktype.includes('Ranged') != true && data.atktype.includes('远程') != true) { filtered = false; break; }
				}
				if(i == 11) {				
					if(data.atktype.includes('None') != true && data.atktype.includes('无') != true && data.atktype.includes('不攻击') != true) { filtered = false; break; }
				}
				if(i == 12) {
					if(data.atkattri != 'Physical' && data.atkattri != '物理') { filtered = false; break; }
				}
				if(i == 13) {
					if(data.atkattri != 'Arts' && data.atkattri != '法术') { filtered = false; break; }
				}
				if(i == 14) {
					if(data.atkattri != 'Healing' && data.atkattri != '治疗') { filtered = false; break; }
				}
			}
		}

		return filtered;
	}
	
	$(document).ready(function(e) {
		var hash = (window.location.hash).replace('#', '');
		if (hash.length != 0) {
			hash = hash.replaceAll('_', ' ');
			for(var i = 0; i < eJson.length; i++) {
				if(eJson[i].name == hash) {
					lightBox.classList.add('active');
					const infoBox = document.createElement('div');
					var tempData;

					tempData = eJson[i];

					infoBox.id = 'infoBox';
					$('title').text(tempData.name);
					$('meta[name=description]').attr('content', tempData.name);
					$('meta[property="og:image"]').attr('content', "static/assets/enemies/" + tempData.code + ".png");

					htmlText = `<span class="display-6" style="font-size:35px;">${tempData.name}</span>
						<span id="closeBox" class="display-6 closeBox" style="display:font-size:35px; float:right; position:sticky; position: -webkit-sticky; top:0; cursor: pointer;">×</span>
						<hr/>
						<div style="display:flex; align-items:center;">
							<figure style="margin-right: 20px;">
								<img src="${tempData.address}" style="width: 100px; height: 100px;">
								<figcaption>${tempData.index}</figcaption>
							</figure>`;

					if(tempData.race == '') {
						htmlText = htmlText.concat(`<p><strong>Level: </strong>${tempData.level}<br><strong>Attack Type: </strong>${tempData.atktype}<br><strong>Damage Type: </strong>${tempData.atkattri}</p></div>`);
					}
					else {
						htmlText = htmlText.concat(`<p><strong>Level: </strong>${tempData.level}<br><strong>Race: </strong>${tempData.race}<br><strong>Attack Type: </strong>${tempData.atktype}<br><strong>Damage Type: </strong>${tempData.atkattri}</p></div>`);
					}

					htmlText = htmlText.concat(`
						<div style="display:flex; align-items:center; justify-content:left; gap:20px; margin-bottom: 18px;">
							<div style="width:70px; height:70px; border: #3e3e3e solid; text-align:center; line-height:70px; position: relative;">
								<img src="/enemy/static/assets/hp.png" style="width: 21px; height: 21px; top:0; left:0; position: absolute; border-bottom: #3e3e3e solid; border-right: #3e3e3e solid">
								<h3 style="margin-top:18px;">${tempData.endure}</h3>
							</div>
							<div style="width:70px; height:70px; border: #3e3e3e solid; text-align:center; line-height:70px; position: relative;">
								<img src="/enemy/static/assets/atk.png" style="width: 21px; hheight: 21px; top:0; left:0; position: absolute; border-bottom: #3e3e3e solid; border-right: #3e3e3e solid">
								<h3 style="margin-top:18px;">${tempData.attack}</h3>
							</div>
							<div style="width:70px; height:70px; border: #3e3e3e solid; text-align:center; line-height:70px; position: relative;">
								<img src="/enemy/static/assets/defense.png" style="width: 21px; height: 21px; top:0; left:0; position: absolute; border-bottom: #3e3e3e solid; border-right: #3e3e3e solid">
								<h3 style="margin-top:18px;">${tempData.defence}</h3>
							</div>
							<div style="width:70px; height:70px; border: #3e3e3e solid; text-align:center; line-height:70px; position: relative;">
								<img src="/enemy/static/assets/resistance.png" style="width: 21px; height: 21px; top:0; left:0; position: absolute; border-bottom: #3e3e3e solid; border-right: #3e3e3e solid">
								<h3 style="margin-top:18px;">${tempData.resistance}</h3>
							</div>
						</div>
						<span class="display-6" style="font-size:25px;">Description</span>
						<hr style="margin-bottom:5px; margin-top:5px;"/>
						<p>${tempData.description}</p>
						<span class="display-6" style="font-size:25px;">Ability</span>
						<hr style="margin-bottom:5px; margin-top:5px;"/>
						<p>${tempData.ability}</p>`)

					for(var i = 0; i < tempData.statlevels; i++) {
						var level = "Level ";
						level = level.concat(i.toString());

						htmlText = htmlText.concat(`
							<span class="display-6" style="font-size:25px;">${level}</span>
							<hr style="margin-bottom:5px; margin-top:5px;"/>
							<table class="table table-sm table-bordered" style="text-align: center; table-layout: fixed;">
								<thead class="thead-light">
									<tr style="background-color: #dbdbdb;">
										<th scope="col" style="text-overflow: ellipsis; overflow: hidden;">HP</th>
										<th scope="col" style="text-overflow: ellipsis; overflow: hidden;">Attack</th>
										<th scope="col" style="text-overflow: ellipsis; overflow: hidden;">Defense</th>
										<th scope="col" style="text-overflow: ellipsis; overflow: hidden;">Resistance</th>
										<th scope="col" style="text-overflow: ellipsis; overflow: hidden;">HP Seals</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>${tempData.lhp[i]}</td>
										<td>${tempData.latk[i]}</td>
										<td>${tempData.ldef[i]}</td>
										<td>${tempData.lres[i]}</td>
										<td>${tempData.lseal[i]}</td>
									</tr>
								</tbody>
								<thead class="thead-light">
									<tr style="background-color: #dbdbdb;">
										<th scope="col" style="text-overflow: ellipsis; overflow: hidden;">ATK Interval</th>
										<th scope="col" style="text-overflow: ellipsis; overflow: hidden;">ATK Radius</th>
										<th scope="col" style="text-overflow: ellipsis; overflow: hidden;">Speed</th>
										<th scope="col" style="text-overflow: ellipsis; overflow: hidden;">Weight</th>
										<th scope="col" style="text-overflow: ellipsis; overflow: hidden;">HP Regen</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>${tempData.latkint[i]}</td>
										<td>${tempData.lrange[i]}</td>
										<td>${tempData.lmvspd[i]}</td>
										<td>${tempData.lweight[i]}</td>
										<td>${tempData.lregen[i]}</td>
									</tr>
								</tbody>
							</table>
						`)
					}

					htmlText = htmlText.concat(`
						<span class="display-6" style="font-size:25px;">Immunity</span>
						<hr style="margin-bottom:5px; margin-top:5px;"/>
						<p>${tempData.immunity}</p>
						<span class="display-6" style="font-size:25px;">Talents</span>
						<hr style="margin-bottom:5px; margin-top:5px;"/>
						<p>${tempData.talent}</p>
						<span class="display-6" style="font-size:25px;">Skills</span>
						<hr style="margin-bottom:5px; margin-top:5px;"/>`)

					if(tempData.skill == 'None') {
						htmlText = htmlText.concat(`<p>None</p>`);
					}
					else {
						htmlText = htmlText.concat(`
							<table class="table table-sm table-bordered" style="text-align: center;">
								<thead class="thead-light">
									<tr style="background-color: #dbdbdb;">
										<th scope="col">Name</th>
										<th scope="col">Initial</th>
										<th scope="col">Cost</th>
										<th scope="col">Type</th>
										<th scope="col">Effect</th>
									</tr>
								</thead>`);

						for(var j = 0; j < tempData.skillnum; j++) {
							htmlText = htmlText.concat(`
								<tbody>
									<tr>
										<td>${tempData.skill[j].name}</td>
										<td>${tempData.skill[j].initial}</td>
										<td>${tempData.skill[j].cost}</td>
										<td>${tempData.skill[j].type}</td>
										<td>${tempData.skill[j].effect}</td>
									</tr>
								</tbody>`);

						}

						htmlText = htmlText.concat(`</table>`);
					}

					infoBox.innerHTML = htmlText;
					while(lightBox.firstChild) { lightBox.removeChild(lightBox.firstChild); }
					lightBox.appendChild(infoBox);
					document.body.style.overflow = 'hidden';
					break;
				}
			}
		}
	});

	function filterSearch(data) {
		tempName = data.name.toLowerCase();
		tempIndex = data.index.toLowerCase()
		tempVal = searchVal.toLowerCase();
		return (tempName.includes(tempVal) || tempIndex.includes(tempVal));
	}

	function handleSearch(e) {
		searchVal = e.target.value;
		deleteChildren(document.querySelector('#enemyWidget'));
		deleteChildren(document.querySelector('#enemyWidget_CN'));
		filterChildren();
		addBoxToCard();
	}

	function filterChildren() {
		var checkVal = true;
		var searchCheck = true;
		for(var j = 0; j < filterArr.length; j++) {
			if(filterArr[j] != -1 || searchVal != '') { checkVal = false; }
			if(filterArr[j] != -1) { searchCheck = false; }
		}

		if(checkVal == true) {
			for(var i = 0; i < eJson.length; i++) {
				const enDiv = document.getElementById("enemyWidget");
				const cnDiv = document.getElementById("enemyWidget_CN");
				name = eJson[i].name;
				source = eJson[i].address;
				caption = eJson[i].index;
				ref = eJson[i].name.replaceAll(' ', '_');
				img = `<a href="#${ref}"><div class="enemyCard" id="#${eJson[i].code}" name="${name}"><figure><img src= ${source} style="width: 80px; height: 80px;"><figcaption>${caption}</figcaption></figure></div></a>`;
				if(eJson[i].server == 'EN') { enDiv.insertAdjacentHTML('beforeend', img); }
				else { cnDiv.insertAdjacentHTML('beforeend', img); }
			}
		}
		else {
			var filteredList = eJson.filter(filterData);

			if(searchVal != '') {
				if(searchCheck == true) { filteredList = eJson.filter(filterSearch); }
				else { filteredList = filteredList.filter(filterSearch); }
			}

			for(var i = 0; i < filteredList.length; i++) {
				const enDiv = document.getElementById("enemyWidget");
				const cnDiv = document.getElementById("enemyWidget_CN");
				name = filteredList[i].name;
				source = filteredList[i].address;
				caption = filteredList[i].index;
				ref = filteredList[i].name.replaceAll(' ', '_');
				img = `<a href="#${ref}"><div class="enemyCard" id="#${filteredList[i].code}" name="${name}"><figure><img src= ${source} style="width: 80px; height: 80px;"><figcaption>${caption}</figcaption></figure></div></a>`;
				if(filteredList[i].server == 'EN') { enDiv.insertAdjacentHTML('beforeend', img); }
				else { cnDiv.insertAdjacentHTML('beforeend', img); }
			}
		}
	}
	
	$("#bnormal").click(function() {
		filterArr[0] *= -1;
		filterArr[1] = -1;
		filterArr[2] = -1;
		var elem = document.getElementById('bnormal');
		if(filterArr[0] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		deleteChildren(document.querySelector('#enemyWidget'));
		deleteChildren(document.querySelector('#enemyWidget_CN'));
		filterChildren();
		addBoxToCard();
	});

	$("#belite").click(function() {
		filterArr[0] = -1;
		filterArr[1] *= -1;
		filterArr[2] = -1;
		var elem = document.getElementById('belite');
		if(filterArr[1] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		deleteChildren(document.querySelector('#enemyWidget'));
		deleteChildren(document.querySelector('#enemyWidget_CN'));
		filterChildren();
		addBoxToCard();
	});

	$("#bboss").click(function() {
		filterArr[0] = -1;
		filterArr[1] = -1;
		filterArr[2] *= -1;
		var elem = document.getElementById('bboss');
		if(filterArr[2] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		deleteChildren(document.querySelector('#enemyWidget'));
		deleteChildren(document.querySelector('#enemyWidget_CN'));
		filterChildren();
		addBoxToCard();
	});

	$("#binfcrea").click(function() {
		filterArr[3] *= -1;
		filterArr[4] = -1;
		filterArr[5] = -1;
		filterArr[6] = -1;
		filterArr[7] = -1;
		filterArr[8] = -1;
		var elem = document.getElementById('binfcrea');
		if(filterArr[3] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		deleteChildren(document.querySelector('#enemyWidget'));
		deleteChildren(document.querySelector('#enemyWidget_CN'));
		filterChildren();
		addBoxToCard();
	});

	$("#bdrone").click(function() {
		filterArr[3] = -1;
		filterArr[4] *= -1;
		filterArr[5] = -1;
		filterArr[6] = -1;
		filterArr[7] = -1;
		filterArr[8] = -1;
		var elem = document.getElementById('bdrone');
		if(filterArr[4] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		deleteChildren(document.querySelector('#enemyWidget'));
		deleteChildren(document.querySelector('#enemyWidget_CN'));
		filterChildren();
		addBoxToCard();
	});

	$("#bsarkaz").click(function() {
		filterArr[3] = -1;
		filterArr[4] = -1;
		filterArr[5] *= -1;
		filterArr[6] = -1;
		filterArr[7] = -1;
		filterArr[8] = -1;
		var elem = document.getElementById('bsarkaz');
		if(filterArr[5] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		deleteChildren(document.querySelector('#enemyWidget'));
		deleteChildren(document.querySelector('#enemyWidget_CN'));
		filterChildren();
		addBoxToCard();
	});

	$("#bpossessed").click(function() {
		filterArr[3] = -1;
		filterArr[4] = -1;
		filterArr[5] = -1;
		filterArr[6] *= -1;
		filterArr[7] = -1;
		filterArr[8] = -1;
		var elem = document.getElementById('bpossessed');
		if(filterArr[6] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		deleteChildren(document.querySelector('#enemyWidget'));
		deleteChildren(document.querySelector('#enemyWidget_CN'));
		filterChildren();
		addBoxToCard();
	});

	$("#bseamon").click(function() {
		filterArr[3] = -1;
		filterArr[4] = -1;
		filterArr[5] = -1;
		filterArr[6] = -1;
		filterArr[7] *= -1;
		filterArr[8] = -1;
		var elem = document.getElementById('bseamon');
		if(filterArr[7] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		deleteChildren(document.querySelector('#enemyWidget'));
		deleteChildren(document.querySelector('#enemyWidget_CN'));
		filterChildren();
		addBoxToCard();
	});

	$("#bartscrea").click(function() {
		filterArr[3] = -1;
		filterArr[4] = -1;
		filterArr[5] = -1;
		filterArr[6] = -1;
		filterArr[7] = -1;
		filterArr[8] *= -1;
		var elem = document.getElementById('bartscrea');
		if(filterArr[8] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		deleteChildren(document.querySelector('#enemyWidget'));
		deleteChildren(document.querySelector('#enemyWidget_CN'));
		filterChildren();
		addBoxToCard();
	});

	$("#bmelee").click(function() {
		filterArr[9] *= -1;
		filterArr[11] = -1;
		var elem = document.getElementById('bnoatk');
		if(filterArr[9] == 1) {
			elem.checked = false;
		}
		deleteChildren(document.querySelector('#enemyWidget'));
		deleteChildren(document.querySelector('#enemyWidget_CN'));
		filterChildren();
		addBoxToCard();
	});

	$("#branged").click(function() {
		filterArr[10] *= -1;
		filterArr[11] = -1;
		var elem = document.getElementById('bnoatk');
		if(filterArr[10] == 1) {
			elem.checked = false;
		}
		deleteChildren(document.querySelector('#enemyWidget'));
		deleteChildren(document.querySelector('#enemyWidget_CN'));
		filterChildren();
		addBoxToCard();
	});

	$("#bnoatk").click(function() {
		filterArr[9] = -1;
		filterArr[10] = -1;
		filterArr[11] *= -1;
		var elem1 = document.getElementById('bmelee');
		var elem2 = document.getElementById('branged');
		if(filterArr[11] == 1) {
			elem1.checked = false;
			elem2.checked = false;
		}
		deleteChildren(document.querySelector('#enemyWidget'));
		deleteChildren(document.querySelector('#enemyWidget_CN'));
		filterChildren();
		addBoxToCard();
	});

	$("#bphys").click(function() {
		filterArr[12] *= -1;
		filterArr[13] = -1;
		filterArr[14] = -1;
		var elem = document.getElementById('bphys');
		if(filterArr[12] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		deleteChildren(document.querySelector('#enemyWidget'));
		deleteChildren(document.querySelector('#enemyWidget_CN'));
		filterChildren();
		addBoxToCard();
	});

	$("#barts").click(function() {
		filterArr[12] = -1;
		filterArr[13] *= -1;
		filterArr[14] = -1;
		var elem = document.getElementById('barts');
		if(filterArr[13] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		deleteChildren(document.querySelector('#enemyWidget'));
		deleteChildren(document.querySelector('#enemyWidget_CN'));
		filterChildren();
		addBoxToCard();
	});

	$("#bheal").click(function() {
		filterArr[12] = -1;
		filterArr[13] = -1;
		filterArr[14] *= -1;
		var elem = document.getElementById('bheal');
		if(filterArr[14] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		deleteChildren(document.querySelector('#enemyWidget'));
		deleteChildren(document.querySelector('#enemyWidget_CN'));
		filterChildren();
		addBoxToCard();
	});
	
	$("#bclear").click(function() {
		for(var i = 0; i < filterArr.length; i++) { filterArr[i] = -1; }
		
		var elem = document.getElementsByClassName('cboxButton');
		for(var j = 0; j < elem.length; j++) { elem[j].checked = false; }
		deleteChildren(document.querySelector('#enemyWidget'));
		deleteChildren(document.querySelector('#enemyWidget_CN'));
		filterChildren();
		addBoxToCard();
	});
	
	$(document).on('click','#closeBox', function(e){
		lightBox.classList.remove('active');
		document.body.style.overflow = 'visible';
	});
});
