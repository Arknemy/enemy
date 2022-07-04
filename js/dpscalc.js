var dpsJson;
fetch('/enemy/static/data/dps_alldata.json')
.then(response => response.json())
.then(data => {
	dpsData = data;

	const lightBox = document.createElement('div');
	lightBox.id = 'lightBox';
	document.getElementById('mainDiv').appendChild(lightBox);

	lightBox.addEventListener('click', e => {
		if(e.target != e.currentTarget) return;
		infoBox.classList.remove('active');
		lightBox.classList.remove('active');
		document.body.style.overflow = 'visible';
	});

	$(document).on('click','#closeBox, .oplink', function(e){
		infoBox.classList.remove('active');
		lightBox.classList.remove('active');
		document.body.style.overflow = 'visible';
	});

	function subtractOrundum() {
		const orunCount = document.querySelector("#orundumCount");
		const bg = document.querySelector("#orundumbg");
		var oc = orunCount.innerHTML;
		oc -= 600;
		orunCount.innerHTML = oc;
		var bgwidth = orunCount.offsetWidth + 90;
		bg.style.width = bgwidth + 'px';
	}

	function selectOperator(caller) {
		lightBox.classList.add('active');
		const infoBox = document.createElement('div');
		infoBox.id = 'infoBox';
		var htmlText = '';
		var opArray = [['Vanguard', 'PIONEER'], ['Guard', 'WARRIOR'], ['Defender', 'TANK'], ['Sniper', 'SNIPER'], ['Caster', 'CASTER'], ['Medic', 'MEDIC'], ['Supporter', 'SUPPORT'], ['Specialist', 'SPECIAL']]

		for(var op = 0; op < opArray.length; op++) {
			if(op == 0) htmlText = htmlText.concat(`<span id="closeBox" class="display-6 closeBox" style="font-size:35px; float:right; position:relative; position: -webkit-relative; top:-15px; cursor: pointer;">×</span>`);

			htmlText = htmlText.concat(`
				<span class="display-6" style="font-size:25px; margin-bottom: 10px;">${opArray[op][0]}</span>
				<div class="" style="display: flex; align-items: center; justify-content: flex-start; margin-top: 5px;">
					<img src="/enemy/static/assets/icons/${opArray[op][0].toLowerCase()}.png" style="width: 70px; height: 70px; margin-right: 20px; filter: invert(100%); box-shadow: 0px 4px 10px;">
					<div>`);

			for(var i = 5; i >= 2; i--) {
				if(opArray[op][0] == 'Specialist' && i == 2) continue;
				htmlText = htmlText.concat(`<div style="margin: auto 0px; padding-left: 2em; text-indent:-2em;"><strong>${i + 1}★: </strong>`);
				var empty = true;
				for(var j = 0; j < dpsData.length; j++) {
					if(dpsData[j].class == opArray[op][1] && dpsData[j].rarity == i) {
						if(empty == false) htmlText = htmlText.concat(`, `);
						htmlText = htmlText.concat(`<a href="#/" id="${caller} ${dpsData[j].code}" class="oplink">${dpsData[j].name}</a>`);
						empty = false;
					}
				}
				htmlText = htmlText.concat(`</div>`);
			}
			htmlText = htmlText.concat(`</div></div>`);
			if(op != 7) htmlText = htmlText.concat(`<hr/>`);
			else htmlText = htmlText.concat(`<div style="height: 15px;"></div>`);
		}
			
		infoBox.innerHTML = htmlText;
		while(lightBox.firstChild) { lightBox.removeChild(lightBox.firstChild); }
		lightBox.appendChild(infoBox);
		setTimeout(function() {
			infoBox.classList.add('active');
		}, 1);
		document.body.style.overflow = 'hidden';
	}

	$(document).on('click','.oplink', function(e) {
		subtractOrundum();
		widgetNum = e.target.id.split(' ')[0].match(/\d+/)[0];
		targetOp = e.target.id.split(' ')[1];
		targetWidget = 'calcWidget' + widgetNum;

		cw = document.getElementById(targetWidget);
		if(cw.classList.contains('active') == true) {
			var tempcw = cw.cloneNode(true);
			cw.parentNode.replaceChild(tempcw, cw);
			tempcw.classList.add('disable');
			setTimeout(function() {
				tempcw.classList.remove('disable');
				loadOperator(targetOp, targetWidget);
			}, 450);
		}	
		else {
			cw.classList.add('active');
			loadOperator(targetOp, targetWidget);
		}
	});

	function loadOperator(targetOp, targetWidget) {
		for(var i = 0; i < dpsData.length; i++) {
			if(dpsData[i].code == targetOp) {
				operator = dpsData[i];
				cwName = document.getElementById(targetWidget + 'Name');
				cwName.innerHTML = operator.name;

				cwImg = document.getElementById(targetWidget + 'Img');
				if(operator.name == 'Amiya') cwImg.src = `/enemy/static/assets/operators/amiya3.png`;
				else if(operator.promoLevels == 2) cwImg.src = `/enemy/static/assets/operators/${operator.name.toLowerCase()}2.png`;
				else cwImg.src = `/static/assets/operators/${operator.name.toLowerCase()}1.png`;

				cwPromo = document.getElementById(targetWidget + 'Promotion');
				opHTML = '';
				for(var j = 0; j < operator.promoLevels + 1; j++) {
					if(j < operator.promoLevels) opHTML = opHTML.concat(`<option class="cwDropdownContent display-6" value="${j}">${j}</option>`);
					else opHTML = opHTML.concat(`<option class="cwDropdownContent display-6" value="${j}" selected="selected">${j}</option>`);
				}
				cwPromo.innerHTML = opHTML;

				cwLevel = document.getElementById(targetWidget + 'Level');
				opHTML = '';
				for(var j = 0; j < operator.promoStats[operator.promoLevels].maxLevel; j++) {
					if(j < operator.promoStats[operator.promoLevels].maxLevel - 1) opHTML = opHTML.concat(`<option class="cwDropdownContent display-6" value="${j + 1}">${j + 1}</option>`);
					else opHTML = opHTML.concat(`<option class="cwDropdownContent display-6" value="${j + 1}" selected="selected">${j + 1}</option>`);
				}
				cwLevel.innerHTML = opHTML;

				cwPotential = document.getElementById(targetWidget + 'Potential');
				if(operator.potential.length == 0) {
					cwPotential.innerHTML = `<option class="cwDropdownContent display-6" value="6" selected="selected">6</option>`;
					cwPotential.disabled = true;
				}
				else {
					cwPotential.disabled = false;
					opHTML = '';
					for(var j = 0; j < 6; j++) {
						if(j < 5) opHTML = opHTML.concat(`<option class="cwDropdownContent display-6" value="${j + 1}">${j + 1}</option>`);
						else opHTML = opHTML.concat(`<option class="cwDropdownContent display-6" value="${j + 1}" selected="selected">${j + 1}</option>`);
					}
					cwPotential.innerHTML = opHTML;
				}

				cwTrust = document.getElementById(targetWidget + 'Trust');
				opHTML = ''
				for(var j = 0; j < 100; j++) {
					if(j < 99) opHTML = opHTML.concat(`<option class="cwDropdownContent display-6" value="${j + 1}">${j + 1}</option>`);
					else opHTML = opHTML.concat(`<option class="cwDropdownContent display-6" value="${j + 1}" selected="selected">${j + 1}</option>`);
				}
				cwTrust.innerHTML = opHTML;

				document.getElementById(targetWidget + 'Module').disabled = true;
				document.getElementById(targetWidget + 'ModuleLevel').disabled = true;

				// stuff with mods go here
				// stuff with mods go here
				// stuff with mods go here
				// stuff with mods go here
				// stuff with mods go here
				// stuff with mods go here

				cwSkill = document.getElementById(targetWidget + 'Skill');
				opHTML = '';
				for(var j = 0; j < operator.skills.length; j++) {
					if(j < operator.skills.length - 1) opHTML = opHTML.concat(`<option class="cwDropdownContent display-6" value="${operator.skills[j].levels[0].name}">${operator.skills[j].levels[0].name}</option>`);
					else opHTML = opHTML.concat(`<option class="cwDropdownContent display-6" value="${operator.skills[j].levels[0].name}" selected="selected">${operator.skills[j].levels[0].name}</option>`);
				}
				cwSkill.innerHTML = opHTML;

				cwSkillRank = document.getElementById(targetWidget + 'SkillRank');
				opHTML = '';
				var rank = 10;
				if(operator.promoLevels < 2) rank = 7;
				for(var j = 0; j < rank; j++) {
					if(j < rank - 1) opHTML = opHTML.concat(`<option class="cwDropdownContent display-6" value="${j + 1}">${j + 1}</option>`);
					else opHTML = opHTML.concat(`<option class="cwDropdownContent display-6" value="${j + 1}" selected="selected">${j + 1}</option>`);
				}
				cwSkillRank.innerHTML = opHTML;

				calculateDps(operator, targetWidget);
				break;
			}
		}
	}

 // elite = -1, level = -1, pot = -1, trust = -1, skill = -1, skillrank = -1

	function calculateDps(operator, targetWidget) {
		var baseAtk;
		var baseDef;
		var baseAspd = 1;
		var baseAtkInterval;
		var baseDefPen = 1;
		var baseDefFlatPen = 0;
		var baseResPen = 1;
		var baseResFlatPen = 0;
		var baseDefIgnore = 0;
		var baseResIgnore = 0;
		var baseDefFlatIgnore = 0;
		var baseResFlatIgnore = 0;
		var baseBlock;
		var baseMaxTarget = 1;
		var baseSP = 1;
		var spRecoveryTime;
		var skillDps;
		var skillTotalDamage = 0;

		var enemycount = 1;
		var enemyDef = 0;
		var enemyRes = 0;

		var flatAtkBuff = 0;
		var percentAtkBuff = 0;
		var damageBuff = 1;
		var spRechargeBuff = 0;

		var elite = document.getElementById(targetWidget + 'Promotion').value;
		var level = document.getElementById(targetWidget + 'Level').value;
		var pot = document.getElementById(targetWidget + 'Potential').value;
		var trust = document.getElementById(targetWidget + 'Trust').value;
		var skill = document.getElementById(targetWidget + 'Skill').value;
		var skillRank = document.getElementById(targetWidget + 'SkillRank').value;
		
		var atkTrustGrowth = operator.trustStats[1].data.atk / 100;
		var defTrustGrowth = operator.trustStats[1].data.def / 100;
		var hpTrustGrowth = operator.trustStats[1].data.maxHp / 100;
		var atkTrustBonus = Math.floor(atkTrustGrowth * trust);
		var defTrustBonus = Math.floor(defTrustGrowth * trust);
		var hpTrustBonus = Math.floor(hpTrustGrowth * trust);
		
		baseAtk = operator.promoStats[elite].attributesKeyFrames[0].data.atk;
		atkStatGrowth = (operator.promoStats[elite].attributesKeyFrames[1].data.atk - baseAtk) / (operator.promoStats[elite].attributesKeyFrames[1].level - 1);
		baseAtk = baseAtk + Math.round(atkStatGrowth * (level - 1)) + atkTrustBonus;

		baseDef = operator.promoStats[elite].attributesKeyFrames[0].data.def;
		defStatGrowth = (operator.promoStats[elite].attributesKeyFrames[1].data.def - baseDef) / (operator.promoStats[elite].attributesKeyFrames[1].level - 1);
		baseDef = baseDef + Math.round(defStatGrowth * (level - 1)) + defTrustBonus;

		baseAtkInterval = operator.promoStats[elite].attributesKeyFrames[0].data.baseAttackTime;
		baseBlock = operator.promoStats[elite].attributesKeyFrames[0].data.blockCnt;

		for(var i = 0; i < pot - 1; i++) {
			if(operator.potential.length != 0) {
				if(operator.potential[i].type == 0) {
					var statBuff = operator.potential[i].buff.attributes.attributeModifiers[0].attributeType;
					if(statBuff == 1)
						baseAtk += operator.potential[i].buff.attributes.attributeModifiers[0].value;
					else if(statBuff == 2)
						baseDef += operator.potential[i].buff.attributes.attributeModifiers[0].value;
					else if(statBuff == 7)
						baseAspd += operator.potential[i].buff.attributes.attributeModifiers[0].value / 100;
				}
			}
		}

		var talentKey = operator.talents.length;
		var talentArr = [];

		for(var i = 0; i < talentKey; i++) {
			var tempTalentArr = []

			for(var j = 0; j < operator.talents[i].candidates.length; j++) {
				if((operator.talents[i].candidates[j].unlockCondition.phase <= elite && operator.talents[i].candidates[j].requiredPotentialRank <= pot - 1) || operator.potential.length == 0) {
					tempTalentArr = []
					for(var k = 0; k < operator.talents[i].candidates[j].blackboard.length; k++)
						tempTalentArr.push([operator.talents[i].candidates[j].blackboard[k].key, operator.talents[i].candidates[j].blackboard[k].value]);
				}
			}
			talentArr.push(tempTalentArr);
		}

		var skillDuration;
		var skillInfinite = false;
		var skillCost;
		var skillRecoveryType = 'natural'
		var skillArr = [];
		var selectedSkill;

		for(var i = 0; i < operator.skills.length; i++) {
			if(operator.skills[i].levels[0].name == skill) {
				selectedSkill =  operator.skills[i].levels[skillRank - 1];
				skillDuration = selectedSkill.duration;
				if(skillDuration == 0);
				if(skillDuration == -1) skillInfinite = true;
				skillCost = selectedSkill.spData.spCost;
				if(selectedSkill.spData.spType == 2) skillRecoveryType = 'attack';
				if(selectedSkill.spData.spType == 4) skillRecoveryType = 'defense';
				if(selectedSkill.spData.spType == 8) skillRecoveryType = 'burst';

				for(var j = 0; j < selectedSkill.blackboard.length; j++)
					skillArr.push([selectedSkill.blackboard[j].key, selectedSkill.blackboard[j].value]);
				break;
			}
		}

		// Naughty list
		var talentExceptions = ['Mountain', 'Bagpipe', 'Meteorite', 'Mousse', 'Irene', 'Franka', 'Indra'];

		var atkUp = 1;
		var defUp = 1;
		var atkScale = 1;
		var damageScale = 1;
		var aspd = baseAspd;
		var atkInterval = baseAtkInterval;
		var atkUpArr = ['atk', 'phenxi_t_1[peak_2].peak_performance.atk', 'peak_performance.atk'];
		var atkScaleArr = ['atk_scale'];
		var aspdArr = ['min_attack_speed', 'attack_speed'];

		for(var i = 0; i < talentArr.length; i++) {
			for(var j = 0; j < talentArr[i].length; j++) {
				if(atkUpArr.includes(talentArr[i][j][0]))
					atkUp += talentArr[i][j][1];
				else if(talentArr[i][j][0] == 'def')
					defUp += talentArr[i][j][1];
				else if(aspdArr.includes(talentArr[i][j][0]))
					aspd += talentArr[i][j][1] / 100;
				else if(talentArr[i][j][0] == 'base_attack_time')
					atkInterval += talentArr[i][j][1];
				else if(atkScaleArr.includes(talentArr[i][j][0]))
					atkScale *= talentArr[i][j][1];
				else if(talentArr[i][j][0] == 'damage_scale')
					damageScale *= talentArr[i][j][1];
				else if(talentArr[i][j][0] == 'def_penetrate')
					baseDefIgnore -= 1 - talentArr[i][j][1];
				else if(talentArr[i][j][0] == 'def_penetrate_fixed')
					baseDefFlatIgnore += talentArr[i][j][1];
			}
		}

		if(talentExceptions.includes(operator.name)) {

		}
		else {
			var normalAtk = baseAtk * atkUp * atkScale - (clamp((clamp(enemyDef, baseDefFlatPen) * baseDefPen), baseDefFlatIgnore) * baseDefIgnore);
			var normalAtkInterval = atkInterval / aspd;
			var normalAtkFrames = Math.round(30 * normalAtkInterval);
			var normalDps = Math.round(((normalAtk * damageScale) / normalAtkFrames) * 30);
		}

		if(operator.subclass == 'sword') normalDps *= 2;

		var skillOfftime;
		if(skillDuration == 0) skillDuration = atkInterval;
		if(skillRecoveryType == 'natural')
			skillOfftime = skillCost;
		else if(skillRecoveryType == 'attack')
			skillOfftime = (normalAtkFrames * skillCost) / 30;
		else if(skillRecoveryType == 'defense')
			skillOfftime = skillCost / 0.75;

		var skillAtkUp = atkUp;
		var skillDefUp = defUp;
		var skillAtkScale = atkScale;
		var skillDamageScale = damageScale;
		var skillAspd = aspd;
		var skillAtkInterval = atkInterval;
		var skillHitNum = 1;
		var skillMaxTarget = 1;
		var skillBlock = baseBlock;
		var skillBlackboard = selectedSkill.blackboard;

		atkUpArr = ['atk'];
		atkScaleArr = ['atk_scale', 'attack@atk_scale','attack@surtr_s_2[critical].atk_scale'];
		aspdArr = ['min_attack_speed', 'attack_speed'];
		var atkIntervalArr = ['base_attack_time'];
		var hitNumArr = ['attack@times', 'times'];
		var maxTargetArr = ['attack@max_target', 'max_target']

		for(var i = 0; i < skillBlackboard.length; i++) {
			if(atkUpArr.includes(skillBlackboard[i].key))
				skillAtkUp += skillBlackboard[i].value;
			else if(skillBlackboard[i].key == 'def')
				skillDefUp += skillBlackboard[i].value;
			else if(aspdArr.includes(skillBlackboard[i].key))
				skillAspd += skillBlackboard[i].value / 100;
			else if(atkIntervalArr.includes(skillBlackboard[i].key))
				skillAtkInterval += skillBlackboard[i].value;
			else if(atkScaleArr.includes(skillBlackboard[i].key))
				skillAtkScale *= skillBlackboard[i].value;
			else if(skillBlackboard[i].key == 'damage_scale')
				skillDamageScale *= skillBlackboard[i].value;
			else if (hitNumArr.includes(skillBlackboard[i].key))
				skillHitNum = skillBlackboard[i].value;
			else if(skillBlackboard[i].key == 'block_cnt')
				skillBlock += skillBlackboard[i].value;
			else if(skillBlackboard[i].key == 'def_penetrate')
				baseDefIgnore -= 1 - skillBlackboard[i].value;
			else if(skillBlackboard[i].key == 'def_penetrate_fixed')
				baseDefFlatIgnore += skillBlackboard[i].value;
		}

		var skillExceptions = [];

		if(skillExceptions.includes(operator.name)) {
		}
		else {
			var skillAtk = baseAtk * skillAtkUp * skillAtkScale - (clamp((clamp(enemyDef, baseDefFlatPen) * baseDefPen), baseDefFlatIgnore) * baseDefIgnore);
			skillAtkInterval = skillAtkInterval / skillAspd;
			var skillAtkFrames = Math.round(30 * skillAtkInterval);
			var skillTotalFrames = skillDuration * 30;
			var skillHits = Math.round(skillTotalFrames / skillAtkFrames);
			if(skillHits == 0) skillHits = 1;
			var skillTotalDamage = skillHits * skillAtk;
			var skillDps = Math.round(skillTotalDamage / skillDuration);

			var cycle = skillDuration + skillOfftime;

			if(skillDuration == -1) {
				skillDps = Math.round((skillTotalDamage / skillDuration) / skillAtkInterval);
				var averageDps = skillDps;
			}
			else {
				var offtimeFrames = skillOfftime * 30;
				var normalAtkOfftimeHits = Math.round(offtimeFrames / normalAtkFrames);
				var normalAtkOfftimeDamage = normalAtkOfftimeHits * normalAtk;
				var averageDps = Math.round((skillTotalDamage + normalAtkOfftimeDamage) / cycle);
			}
		}

		// console.log(normalAtk);
		// console.log(normalAtkFrames);
		// console.log(skillOfftime);
		// console.log('normal dps', normalDps);
		// console.log('skill atk', skillAtk);
		// console.log('Hits ', skillHits);
		// console.log('skill dps', skillDps);
		// console.log('cycle', cycle);
		// console.log('average dps', averageDps);

		if(skillDuration == -1)
			outputDps(targetWidget, normalAtk, normalDps, skillAtk, '∞', skillDps, averageDps);
		else
			outputDps(targetWidget, normalAtk, normalDps, skillAtk, skillTotalDamage, skillDps, averageDps);
	}	

	function outputDps(targetWidget, normalAtk, normalDps, skillAtk, skillTotalDamage, skillDps, averageDps) {
		var cw = document.getElementById(targetWidget);
		var htmlText = '';

		normalAtk = Math.round(normalAtk);
		normalDps = Math.round(normalDps);
		skillAtk = Math.round(skillAtk);
		if(skillTotalDamage != '∞')
			skillTotalDamage = Math.round(skillTotalDamage);
		skillDps = Math.round(skillDps);
		averageDps = Math.round(averageDps);

		htmlText = htmlText.concat(`
			<hr/>
			<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
				<span class="display-6" style="font-size: 18px; margin: auto; margin-left: 0px;">Normal Atk Damage:</span>
				<span class="display-6" style="font-size: 18px; margin: auto; margin-right: 0px;">${normalAtk}</span>
			</div>
			<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
				<span class="display-6" style="font-size: 18px; margin: auto; margin-left: 0px;">Normal Atk DPS:</span>
				<span class="display-6" style="font-size: 18px; font-weight: bold; margin: auto; margin-right: 0px;">${normalDps}</span>
			</div>
			<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
				<span class="display-6" style="font-size: 18px; margin: auto; margin-left: 0px;">Skill Atk Damage:</span>
				<span class="display-6" style="font-size: 18px; margin: auto; margin-right: 0px;">${skillAtk}</span>
			</div>
			<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
				<span class="display-6" style="font-size: 18px; margin: auto; margin-left: 0px;">Skill Total Damage:</span>
				<span class="display-6" style="font-size: 18px; margin: auto; margin-right: 0px;">${skillTotalDamage}</span>
			</div>
			<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
				<span class="display-6" style="font-size: 18px; margin: auto; margin-left: 0px;">Skill DPS:</span>
				<span class="display-6" style="font-size: 18px; font-weight: bold; margin: auto; margin-right: 0px;">${skillDps}</span>
			</div>
			<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
				<span class="display-6" style="font-size: 18px; margin: auto; margin-left: 0px;">Average DPS:</span>
				<span class="display-6" style="font-size: 18px; font-weight: bold; margin: auto; margin-right: 0px;">${averageDps}</span>
			</div>
			`);


		const dpsStats = document.createElement('div');
		dpsStats.id = targetWidget + 'dpsStats';
		dpsStats.innerHTML = htmlText;

		const oldStats = document.getElementById(targetWidget + 'dpsStats');

		if(oldStats == null)
			cw.appendChild(dpsStats);
		else
			cw.replaceChild(dpsStats, oldStats);

	}

	function clamp(def, defpen) {
		var result = def - defpen;
		if(result < 0) result = 0;
		return result;
	}


	$("#hhb1, #hhb2, #hhb3, #hhb4").click(function() {
		selectOperator(this.id);
	});

	$(document).on('change','.cwDropdown', function(e){
		var cw = this.id.slice(0, 11);
		var targetWidget = cw;
		var cwName = document.getElementById(cw + 'Name');
		for(var i = 0; i < dpsData.length; i++) {
			if(cwName.innerHTML == dpsData[i].name) {
				operator = dpsData[i];

				if(this.id.includes('Promotion')) {
					promoLevel = document.getElementById(targetWidget + 'Promotion').value;
					cwLevel = document.getElementById(cw + 'Level');
					opHTML = '';
					for(var j = 0; j < operator.promoStats[promoLevel].maxLevel; j++) {
						if(j < operator.promoStats[promoLevel].maxLevel - 1) opHTML = opHTML.concat(`<option class="cwDropdownContent display-6" value="${j + 1}">${j + 1}</option>`);
						else opHTML = opHTML.concat(`<option class="cwDropdownContent display-6" value="${j + 1}" selected="selected">${j + 1}</option>`);
					}
					cwLevel.innerHTML = opHTML;
				}

				calculateDps(operator, cw);
				break;
			}
		}
	});

});
