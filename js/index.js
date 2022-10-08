var eJson;
fetch('/enemy/static/data/enemy_alldata.json')
.then(response => response.json())
.then(data => {
	eJson = data;
		
	let enemyInput = document.querySelector('#searchfield');
	var searchVal = '';
	var filterArr = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
	var eventFilter = '';
	// normal elite boss inf drone sark poss seamons creation apparition mechanical melee ranged doesn'tatk phys arts healing silence stun sleep freeze levitate

	
	$("#main_6, #main_7, #main_8, #main_9, #main_10, #is2, #is3, #dm, #wd, #ut, #sn, #gt, #hosf, #cb, #tw, #ggc, #mn, #mb, #wr, #od, #dh, #nl, #bi, #iw, #ga, #le, #dv, #ic").click(function() {
		var sourceId = $(this).attr('id');
		document.querySelector("#dropdownButton").innerText = document.getElementById(sourceId).text;
		eventFilter = sourceId;
		selectedFilter();
	});


	$("#beventclear").click(function() {
		eventFilter = '';
		document.querySelector("#dropdownButton").innerText = 'Sort by Event';
		selectedFilter();
	});
	
	
	var scrollButton = document.getElementById('scrollTop');
	$(window).on('scroll', function() {
		if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
			$('#scrollTop').addClass('active');
		} 
		else { $('#scrollTop').removeClass('active'); }
	});

	$("#scrollTop").click(function() {
		$("html, body").animate({ scrollTop: 0 }, 0);
	});

	for(var i = 0; i < eJson.length; i++) {
		const enDiv = document.getElementById("enemyWidget");
		const cnDiv = document.getElementById("enemyWidget_CN");
		name = eJson[i].name;
		source = eJson[i].address;
		caption = eJson[i].index;
		img = `<div class="enemyCard hidden" id="#${eJson[i].code}" name="${name}"><a href="#${eJson[i].code}"><figure><img loading="lazy" src=${source} style="width: 80px; height: 80px;"><figcaption>${caption}</figcaption></figure></a></div>`;
		if(eJson[i].server == 'EN') { enDiv.insertAdjacentHTML('beforeend', img); }
		else { cnDiv.insertAdjacentHTML('beforeend', img); }
	}

	const enemyCards = document.querySelectorAll(".enemyCard");
	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if(entry.isIntersecting) {
				entry.target.classList.remove('hidden');
				entry.target.classList.add('active');
				observer.unobserve(entry.target);
			}
		});
	}, {
		rootMargin: "30px",
	});
	enemyCards.forEach(card => { observer.observe(card); });
	
	const loadObserver = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if(entry.isIntersecting)
				entry.target.classList.add('delay');
			loadObserver.unobserve(entry.target);
		});
	}, {
		rootMargin: "30px",
	});
	enemyCards.forEach(card => { loadObserver.observe(card); });

	enemyInput.oninput = handleSearch;

	const lightBox = document.createElement('div');
	lightBox.id = 'lightBox';
	document.getElementById('mainDiv').appendChild(lightBox);

	lightBox.addEventListener('click', e => {
		if(e.target != e.currentTarget) return;
		infoBox.classList.remove('active');
		lightBox.classList.remove('active');
		window.location.hash = '/';
		document.body.style.overflow = 'visible';
		if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
			$('#scrollTop').addClass('active');
		} 
	});

	$(document).on('click','#closeBox', function(e){
		infoBox.classList.remove('active');
		lightBox.classList.remove('active');
		window.location.hash = '/';
		document.body.style.overflow = 'visible';
		if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
			$('#scrollTop').addClass('active');
		} 
	});

	function addBoxToCard() {
		const enemySelect = document.querySelectorAll(".enemyCard");
		enemySelect.forEach(card => {
			card.addEventListener('click', e => {
				var tempData;
				for(var i = 0; i < eJson.length; i++) {
					if(eJson[i].name == card.getAttribute('name')) { 
						tempData = eJson[i];
						break;
					}
				}

				$('#scrollTop').removeClass('active')
				lightBox.classList.add('active');
				const infoBox = document.createElement('div');
				infoBox.id = 'infoBox';
				var htmlText = getHTMLText(tempData);
				infoBox.innerHTML = htmlText;
				while(lightBox.firstChild) { lightBox.removeChild(lightBox.firstChild); }
				lightBox.appendChild(infoBox);
				setTimeout(function() {
					infoBox.classList.add('active');
				}, 1);
				
				const descHover = document.querySelectorAll('.desc');
				descHover.forEach(tool => {
					if(tool.offsetLeft < 40) tool.classList.add('right');
					else if(infoBox.offsetWidth - tool.offsetLeft < 130) tool.classList.add('left');
				});
				
				document.body.style.overflow = 'hidden';
			});
		});
	}

	addBoxToCard();

	$(document).ready(function(e) {
		var hash = (window.location.hash).replace('#', '');
		if (hash.length != 0) {
			for(var i = 0; i < eJson.length; i++) {
				if(eJson[i].code == hash) {
					var tempData = eJson[i];

					$('#scrollTop').removeClass('active')
					lightBox.classList.add('active');
					const infoBox = document.createElement('div');
					infoBox.id = 'infoBox';
					var htmlText = getHTMLText(tempData);				
					infoBox.innerHTML = htmlText;
					while(lightBox.firstChild) { lightBox.removeChild(lightBox.firstChild); }
					lightBox.appendChild(infoBox);
					infoBox.classList.add('active');
					
					const descHover = document.querySelectorAll('.desc');
					descHover.forEach(tool => {
						if(tool.offsetLeft < 40) tool.classList.add('right');
						else if(infoBox.offsetWidth - tool.offsetLeft < 130) tool.classList.add('left');
					});
					
					document.body.style.overflow = 'hidden';
					break;
				}
			}
		}
	});

	function deleteChildren(parent) {
		while(parent.firstChild) {
			parent.removeChild(parent.firstChild);
		}
	}

	function filterData(fdata) {
		var filtered = true;
		for(var i = 0; i < filterArr.length; i++) {
			if(filterArr[i] == 1) {
				if(i == 0) {
					if(fdata.level != 'Normal') { filtered = false; break; }
				}
				if(i == 1) {
					if(fdata.level != 'Elite') { filtered = false; break; }
				}
				if(i == 2) {
					if(fdata.level != 'Boss') { filtered = false; break; }
				}
				if(i == 3) {
					if(fdata.race != 'Infected Creature' && fdata.race != '感染生物') { filtered = false; break; }
				}
				if(i == 4) {
					if(fdata.race != 'Drone' && fdata.race != '无人机') { filtered = false; break; }
				}
				if(i == 5) {
					if(fdata.race != 'Sarkaz' && fdata.race != '萨卡兹') { filtered = false; break; }
				}
				if(i == 6) {
					if(fdata.race != 'Possessed' && fdata.race != '宿主') { filtered = false; break; }
				}
				if(i == 7) {
					if(fdata.race != 'Sea Monster' && fdata.race != '海怪') { filtered = false; break; }
				}
				if(i == 8) {
					if(fdata.race != 'Arts Creation' && fdata.race != '法术造物') { filtered = false; break; }
				}
				if(i == 9) {
					if(fdata.race != 'Apparition' && fdata.race != '化物') { filtered = false; break; }
				}
				if(i == 10) {
					if(fdata.race != 'Mechanical' && fdata.race != '机械') { filtered = false; break; }
				}
				if(i == 11) {
					if(fdata.atktype.includes('Melee') != true && fdata.atktype.includes('近战') != true) { filtered = false; break; }
				}
				if(i == 12) {
					if(fdata.atktype.includes('Ranged') != true && fdata.atktype.includes('远程') != true) { filtered = false; break; }
				}
				if(i == 13) {				
					if(fdata.atktype.includes('None') != true && fdata.atktype.includes('无') != true && fdata.atktype.includes('不攻击') != true) { filtered = false; break; }
				}
				if(i == 14) {
					if(fdata.atkattri != 'Physical' && fdata.atkattri != '物理') { filtered = false; break; }
				}
				if(i == 15) {
					if(fdata.atkattri != 'Arts' && fdata.atkattri != '法术') { filtered = false; break; }
				}
				if(i == 16) {
					if(fdata.atkattri != 'Healing' && fdata.atkattri != '治疗') { filtered = false; break; }
				}
				if(i == 17) {
					if(fdata.immunity != null) {
						if(fdata.immunity.includes('Silence') == false) { filtered = false; break; }
					}
				}
				if(i == 18) {
					if(fdata.immunity != null)  {
						if(fdata.immunity.includes('Stun') == false) { filtered = false; break; }
					}
				}
				if(i == 19) {
					if(fdata.immunity != null)  {
						if(fdata.immunity.includes('Sleep') == false) { filtered = false; break; }
					}
				}
				if(i == 20) {
					if(fdata.immunity != null)  {
						if(fdata.immunity.includes('Freeze') == false) { filtered = false; break; }
					}
				}
				if(i == 21) {
					if(fdata.immunity != null)  {
						if(fdata.immunity.includes('Airborne') == false) { filtered = false; break; }
					}
				}
			}
		}

		if(eventFilter != '') {
			if(fdata.hasOwnProperty('event')) {
				if(fdata.event != eventFilter) 
					filtered = false;
			}
			else 
				filtered = false;
		}

		return filtered;
	}


	function filterSearch(fdata) {
		var tempName = fdata.name.toLowerCase();
		var tempIndex = fdata.index.toLowerCase()
		var tempVal = searchVal.toLowerCase();
		var tempStage = false;
		for(var i = 0; i < fdata.appearances.length; i++) {
			if(fdata.appearances[i].toLowerCase().includes(tempVal)) { tempStage = true; }
		}
		return (tempName.includes(tempVal) || tempIndex.includes(tempVal) || tempStage);
	}


	function handleSearch(e) {
		searchVal = e.target.value;
		selectedFilter();
	}


	function filterChildren() {
		var checkVal = true;
		var searchCheck = true;
		for(var j = 0; j < filterArr.length; j++) {
			if(filterArr[j] != -1 || searchVal != '' || eventFilter != '') { checkVal = false; }
			if(filterArr[j] != -1 || eventFilter != '') { searchCheck = false; }
		}

		if(checkVal == true) {
			const enemySelect = document.querySelectorAll(".enemyCard");
			enemySelect.forEach(card => {
				card.classList.remove('disable');
				card.classList.add('hidden');
				var newCard = card.cloneNode(true);
				card.parentNode.replaceChild(newCard, card);
				observer.observe(newCard);
			});
		}
		else {
			var filteredList = eJson.filter(filterData);

			if(searchVal != '') {
				if(searchCheck == true) { filteredList = eJson.filter(filterSearch); }
				else { filteredList = filteredList.filter(filterSearch); }
			}

			const enemySelect = document.querySelectorAll(".enemyCard");
			enemySelect.forEach(card => {
				for(var i = 0; i < filteredList.length; i++) {
					if(filteredList[i].name == card.getAttribute('name')) {
						card.classList.remove('disable');
						card.classList.add('hidden');
						var newCard = card.cloneNode(true);
						card.parentNode.replaceChild(newCard, card);
						observer.observe(newCard);
					}
				}
			});
		}

		const enWidget = document.getElementById('enheader');
		const cnWidget = document.getElementById('subheader');
		const enHead = document.querySelectorAll('.enemyWidget .enemyCard');
		const cnHead = document.querySelectorAll('.enemyWidget_CN .enemyCard');
		var enHidden = true, cnHidden = true;

		enHead.forEach(card => {
			console.log(card);
			if(!(card.classList.contains('disable'))) enHidden = false;
		});

		cnHead.forEach(card => {
			if(!(card.classList.contains('disable'))) cnHidden = false;
		});

		console.log(enHidden);

		if(enHidden == true) {
			enWidget.classList.add('disable');
			cnWidget.classList.add('moveup');
		}
		else {
			enWidget.classList.remove('disable');
			cnWidget.classList.remove('moveup');
		}

		if(cnHidden == true) cnWidget.classList.add('disable');
		else cnWidget.classList.remove('disable');
	}


	// filter buttons
	$("#bnormal").click(function() {
		filterArr[0] *= -1;
		filterArr[1] = -1;
		filterArr[2] = -1;
		var elem = document.getElementById('bnormal');
		if(filterArr[0] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		selectedFilter();
	});


	$("#belite").click(function() {
		filterArr[0] = -1;
		filterArr[1] *= -1;
		filterArr[2] = -1;
		var elem = document.getElementById('belite');
		if(filterArr[1] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		selectedFilter();
	});


	$("#bboss").click(function() {
		filterArr[0] = -1;
		filterArr[1] = -1;
		filterArr[2] *= -1;
		var elem = document.getElementById('bboss');
		if(filterArr[2] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		selectedFilter();
	});


	$("#binfcrea").click(function() {
		filterArr[3] *= -1;
		filterArr[4] = -1;
		filterArr[5] = -1;
		filterArr[6] = -1;
		filterArr[7] = -1;
		filterArr[8] = -1;
		filterArr[9] = -1;
		filterArr[10] = -1;
		var elem = document.getElementById('binfcrea');
		if(filterArr[3] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		selectedFilter();
	});


	$("#bdrone").click(function() {
		filterArr[3] = -1;
		filterArr[4] *= -1;
		filterArr[5] = -1;
		filterArr[6] = -1;
		filterArr[7] = -1;
		filterArr[8] = -1;
		filterArr[9] = -1;
		filterArr[10] = -1;
		var elem = document.getElementById('bdrone');
		if(filterArr[4] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		selectedFilter();
	});


	$("#bsarkaz").click(function() {
		filterArr[3] = -1;
		filterArr[4] = -1;
		filterArr[5] *= -1;
		filterArr[6] = -1;
		filterArr[7] = -1;
		filterArr[8] = -1;
		filterArr[9] = -1;
		filterArr[10] = -1;
		var elem = document.getElementById('bsarkaz');
		if(filterArr[5] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		selectedFilter();
	});


	$("#bpossessed").click(function() {
		filterArr[3] = -1;
		filterArr[4] = -1;
		filterArr[5] = -1;
		filterArr[6] *= -1;
		filterArr[7] = -1;
		filterArr[8] = -1;
		filterArr[9] = -1;
		filterArr[10] = -1;
		var elem = document.getElementById('bpossessed');
		if(filterArr[6] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		selectedFilter();
	});


	$("#bseamon").click(function() {
		filterArr[3] = -1;
		filterArr[4] = -1;
		filterArr[5] = -1;
		filterArr[6] = -1;
		filterArr[7] *= -1;
		filterArr[8] = -1;
		filterArr[9] = -1;
		filterArr[10] = -1;
		var elem = document.getElementById('bseamon');
		if(filterArr[7] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		selectedFilter();
	});


	$("#bartscrea").click(function() {
		filterArr[3] = -1;
		filterArr[4] = -1;
		filterArr[5] = -1;
		filterArr[6] = -1;
		filterArr[7] = -1;
		filterArr[8] *= -1;
		filterArr[9] = -1;
		filterArr[10] = -1;
		var elem = document.getElementById('bartscrea');
		if(filterArr[8] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		selectedFilter();
	});

	$("#bapparition").click(function() {
		filterArr[3] = -1;
		filterArr[4] = -1;
		filterArr[5] = -1;
		filterArr[6] = -1;
		filterArr[7] = -1;
		filterArr[8] = -1;
		filterArr[9] *= -1;
		filterArr[10] = -1;
		var elem = document.getElementById('bapparition');
		if(filterArr[9] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		selectedFilter();
	});

	$("#bmechanical").click(function() {
		filterArr[3] = -1;
		filterArr[4] = -1;
		filterArr[5] = -1;
		filterArr[6] = -1;
		filterArr[7] = -1;
		filterArr[8] = -1;
		filterArr[9] = -1;
		filterArr[10] *= -1;
		var elem = document.getElementById('bmechanical');
		if(filterArr[10] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		selectedFilter();
	});


	$("#bmelee").click(function() {
		filterArr[11] *= -1;
		filterArr[13] = -1;
		var elem = document.getElementById('bnoatk');
		if(filterArr[11] == 1) {
			elem.checked = false;
		}
		selectedFilter();
	});


	$("#branged").click(function() {
		filterArr[12] *= -1;
		filterArr[13] = -1;
		var elem = document.getElementById('bnoatk');
		if(filterArr[12] == 1) {
			elem.checked = false;
		}
		selectedFilter();
	});


	$("#bnoatk").click(function() {
		filterArr[11] = -1;
		filterArr[12] = -1;
		filterArr[13] *= -1;
		var elem1 = document.getElementById('bmelee');
		var elem2 = document.getElementById('branged');
		if(filterArr[13] == 1) {
			elem1.checked = false;
			elem2.checked = false;
		}
		selectedFilter();
	});


	$("#bphys").click(function() {
		filterArr[14] *= -1;
		filterArr[15] = -1;
		filterArr[16] = -1;
		var elem = document.getElementById('bphys');
		if(filterArr[14] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		selectedFilter();
	});


	$("#barts").click(function() {
		filterArr[14] = -1;
		filterArr[15] *= -1;
		filterArr[16] = -1;
		var elem = document.getElementById('barts');
		if(filterArr[15] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		selectedFilter();
	});


	$("#bheal").click(function() {
		filterArr[14] = -1;
		filterArr[15] = -1;
		filterArr[16] *= -1;
		var elem = document.getElementById('bheal');
		if(filterArr[16] == -1) {
			if (elem.type == "radio") { elem.checked = false; }
		}
		selectedFilter();
	});


	$("#bsilence").click(function() {
		filterArr[17] *= -1;
		selectedFilter();
	});


	$("#bstun").click(function() {
		filterArr[18] *= -1;
		selectedFilter();
	});


	$("#bsleep").click(function() {
		filterArr[19] *= -1;
		selectedFilter();
	});


	$("#bfreeze").click(function() {
		filterArr[20] *= -1;
		selectedFilter();
	});


	$("#blevitate").click(function() {
		filterArr[21] *= -1;
		selectedFilter();
	});
	
	
	$("#bclear").click(function() {
		for(var i = 0; i < filterArr.length; i++) { filterArr[i] = -1; }
		var elem = document.getElementsByClassName('cboxButton');
		for(var j = 0; j < elem.length; j++) { elem[j].checked = false; }
		selectedFilter();
	});

	function removeDelay() {
		document.querySelectorAll(".enemyCard").forEach(card => {
			card.classList.remove('delay');
		});
	}

	function selectedFilter() {
		const enemySelect = document.querySelectorAll(".enemyCard");
		enemySelect.forEach(card => {
			card.classList.remove('hidden');
			card.classList.remove('active');
			card.classList.add('disable');
		});
		removeDelay();
		filterChildren();
		addBoxToCard();
	}

	function getHTMLText(tempData) {
		htmlText = `<span class="display-6" style="font-size:35px;">${tempData.name}</span>
			<span id="closeBox" class="display-6 closeBox" style="display:font-size:35px; float:right; position:relative; position: -webkit-relative; top:-15px; cursor: pointer;">×</span>
			<hr/>
			<div style="display:flex; align-items:center;">
				<figure style="margin-right: 20px;">
					<img src="${tempData.address}" style="width: 100px; height: 100px;">
					<figcaption>${tempData.index}</figcaption>
				</figure>`;

		if(tempData.race == '') {
			htmlText = htmlText.concat(`<p><strong>Level: </strong>${tempData.level}<br><strong>Attack Type: </strong>${tempData.atktype}<br><strong>Damage Type: </strong>`);
		}
		else {
			htmlText = htmlText.concat(`<p><strong>Level: </strong>${tempData.level}<br><strong>Race: </strong>${tempData.race}<br><strong>Attack Type: </strong>${tempData.atktype}<br><strong>Damage Type: </strong>`);
		}

		if(tempData.atkattri == 'Physical' || tempData.atkattri == '物理')
			htmlText = htmlText.concat(`<span style=\"color: #f56a14\">Physical</span></p>`);
		else if(tempData.atkattri == 'Arts' || tempData.atkattri == '法术')
			htmlText = htmlText.concat(`<span style=\"color: #2467ed\">Arts</span></p>`);
		else if(tempData.atkattri == 'Healing' || tempData.atkattri == '治疗')
			htmlText = htmlText.concat(`<span style=\"color: #30B700\">Healing</span></p>`);

		htmlText = htmlText.concat(`
			</div>
			<div style="display:flex; align-items:center; justify-content:left; gap:20px; margin-bottom: 18px;">
				<div style="width:70px; height:70px; border: #3e3e3e solid; text-align:center; line-height:70px; position: relative;">
					<img src="/enemy/static/assets/icons/hp.png" style="width: 21px; height: 21px; top:0; left:0; position: absolute; border-bottom: #3e3e3e solid; border-right: #3e3e3e solid">
					<h3 style="margin-top:18px;">${tempData.endure}</h3>
				</div>
				<div style="width:70px; height:70px; border: #3e3e3e solid; text-align:center; line-height:70px; position: relative;">
					<img src="/enemy/static/assets/icons/atk.png" style="width: 21px; hheight: 21px; top:0; left:0; position: absolute; border-bottom: #3e3e3e solid; border-right: #3e3e3e solid">
					<h3 style="margin-top:18px;">${tempData.attack}</h3>
				</div>
				<div style="width:70px; height:70px; border: #3e3e3e solid; text-align:center; line-height:70px; position: relative;">
					<img src="/enemy/static/assets/icons/defense.png" style="width: 21px; height: 21px; top:0; left:0; position: absolute; border-bottom: #3e3e3e solid; border-right: #3e3e3e solid">
					<h3 style="margin-top:18px;">${tempData.defence}</h3>
				</div>
				<div style="width:70px; height:70px; border: #3e3e3e solid; text-align:center; line-height:70px; position: relative;">
					<img src="/enemy/static/assets/icons/resistance.png" style="width: 21px; height: 21px; top:0; left:0; position: absolute; border-bottom: #3e3e3e solid; border-right: #3e3e3e solid">
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

		if(tempData.immunity != null) {
			var silence = 'False';
			var stun = 'False';
			var sleep = 'False';
			var freeze = 'False';
			var airborne = 'False'; 
			if(tempData.immunity.includes('Silence')) { silence = '<strong>True</strong>'; }
			if(tempData.immunity.includes('Stun')) { stun = '<strong>True</strong>'; }
			if(tempData.immunity.includes('Sleep')) { sleep = '<strong>True</strong>'; }
			if(tempData.immunity.includes('Freeze')) { freeze = '<strong>True</strong>'; }
			if(tempData.immunity.includes('Airborne')) { airborne = '<strong>True</strong>'; }

			htmlText = htmlText.concat(`
				<span class="display-6" style="font-size:25px;">Immunities</span>
				<hr style="margin-bottom:5px; margin-top:5px;"/>
				<table class="table table-sm table-bordered" style="text-align: center; vertical-align: middle; table-layout: fixed;">
					<thead class="thead-light">
						<tr style="background-color: #dbdbdb; text-decoration: underline;">
							<th scope="col" class="hovertooltip" data-tooltip="Disables certain skills and talents.">Silence</th>
							<th scope="col" class="hovertooltip" data-tooltip="Cannot move, block, attack, or use skills.">Stun</th>
							<th scope="col"  class="hovertooltip" data-tooltip="Invulnerable. Cannot move, block, attack, or use skills.">Sleep</th>
							<th scope="col" class="hovertooltip" data-tooltip="Cannot move, attack, or use skills, -15 RES.">Freeze</th>
							<th scope="col" class="hovertooltip" data-tooltip="Regarded as aerial unit. Cannot move, attack, or use skills. Duration halved if weight > 3.">Levitate</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>${silence}</td>
							<td>${stun}</td>
							<td>${sleep}</td>
							<td>${freeze}</td>
							<td>${airborne}</td>
						</tr>
					</tbody>
				</table>`);
		}
		else {
			htmlText = htmlText.concat(`
				<span class="display-6" style="font-size:25px;">Immunity</span>
				<hr style="margin-bottom:5px; margin-top:5px;"/>
				<p>undefined</p>`);
		}

		htmlText = htmlText.concat(`
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
				<table class="table table-sm table-bordered" style="text-align: center; vertical-align: middle;">
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

		htmlText = htmlText.concat(`<span class="display-6" style="font-size:25px;">Appearances</span>
			<hr style="margin-bottom:5px; margin-top:5px;"/><p>`);
		for(var i = 0; i < tempData.appearances.length; i++) {
			htmlText = htmlText.concat(tempData.appearances[i]);
			if(i < tempData.appearances.length - 1) { htmlText = htmlText.concat(', '); }
			if(i == tempData.appearances.length - 1) { htmlText = htmlText.concat('.'); }
		}
		htmlText = htmlText.concat(`</p>`);

		return htmlText;
	}
});
