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
				else if(operator.promoLevels == 2) cwImg.src = `/enemy/static/assets/operators/${operator.name}2.png`;
				else cwImg.src = `/enemy/static/assets/operators/${operator.name}1.png`;


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
				opHTML = '';
				for(var j = 0; j < 100; j++) {
					if(j < 99) opHTML = opHTML.concat(`<option class="cwDropdownContent display-6" value="${j + 1}">${j + 1}</option>`);
					else opHTML = opHTML.concat(`<option class="cwDropdownContent display-6" value="${j + 1}" selected="selected">${j + 1}</option>`);
				}
				cwTrust.innerHTML = opHTML;


				// document.getElementById(targetWidget + 'Module').disabled = true;
				// document.getElementById(targetWidget + 'ModuleLevel').disabled = true;


				if(operator.module.length != 0) {
					document.getElementById(targetWidget + 'Module').disabled = false;
					cwModule = document.getElementById(targetWidget + 'Module');
					opHTML = '';
					for(var j = 0; j < operator.moduleName.length; j++) {
						if(j == 0) {
							opHTML = opHTML.concat(`<option class="cwDropdownContent display-6" value="basicMod">${operator.moduleName[j]}</option>`);
						}
						else {
							opHTML = opHTML.concat(`<option class="cwDropdownContent display-6" value="${j - 1}0">${operator.moduleName[j]} Lv.1</option>
								<option class="cwDropdownContent display-6" value="${j - 1}1">${operator.moduleName[j]} Lv.2</option>
								<option class="cwDropdownContent display-6" value="${j - 1}2" selected="selected">${operator.moduleName[j]} Lv.3</option>`);
						}
					}
					cwModule.innerHTML = opHTML;
				}
				else {
					cwModule = document.getElementById(targetWidget + 'Module');
					cwModule.innerHTML = '';
					document.getElementById(targetWidget + 'Module').disabled = true;
				}


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


				cwCheckbox = document.getElementById(targetWidget + 'Checkbox');
				cwCheckbox.innerHTML = ''
				opHTML = `<input class="cwInput" type="checkbox" id="${targetWidget}Buffs" value="${targetWidget}Buffs" style="margin-left: 2px;"><label for="${targetWidget}Buffs" class="display-6" style="font-size: 15px; margin-left: 4px;" >Disregard buffs</label><br>`;

				if(operator.subclass == 'lord') {
					opHTML = opHTML.concat(`
						<input class="cwInput" type="checkbox" id="${targetWidget}Lord" value="${targetWidget}Lord" style="margin-left: 2px;"><label for="${targetWidget}Lord" class="display-6" style="font-size: 15px; margin-left: 4px;">Range Penalty</label><br>`);
				}

				for(var j = 0; j < operator.skills.length; j++) {
					if((operator.skills[j].levels[0].spData.spType == 2 && operator.skills[j].levels[6].spData.spCost > 4) || operator.skills[j].levels[0].spData.spType == 4) {
						if(operator.name != 'Ch\'en') {
							opHTML = opHTML.concat(`
								<input class="cwInput" type="checkbox" id="${targetWidget}Scolding" value="${targetWidget}Scolding" style="margin-left: 2px;"><label for="${targetWidget}Scolding" class="display-6" style="font-size: 15px; margin-left: 4px;">Trigger Scolding</label><br>`);
							break;
						}
					}
				}

				for(var j = 0; j < operator.skills.length; j++) {
					if(operator.skills[j].levels[0].spData.spType == 2 && operator.skills[j].levels[0].spData.spCost > 4 && operator.class == 'SNIPER') {
						opHTML = opHTML.concat(`
							<input class="cwInput" type="checkbox" id="${targetWidget}Landen" value="${targetWidget}Landen"  style="margin-left: 2px;"><label for="${targetWidget}Landen" class="display-6" style="font-size: 15px; margin-left: 4px;">Trigger Landen Tactics</label><br>`);
						break;
					}
				}

				cwCheckbox.innerHTML = opHTML;
				calculateDps(operator, targetWidget);
				break;
			}
		}
	}

 // elite = -1, level = -1, pot = -1, trust = -1, skill = -1, skillrank = -1

 	function atkRecoverySim(normalAtkFrames, spCost, chenBonus, chenSp, archettoBonus) {
 		var frames = 0;
 		var sp = 0;
 		var spReduced = 0;
 		var chenFrames = chenBonus * 30;
 		var archettoFrames = archettoBonus * 30;

 		while(true) {
 			frames += 1;

 			if(frames % normalAtkFrames == 0) {
 				sp += 1;
 				if(sp == spCost) frames -= normalAtkFrames / 2;
 			}
 			
 			if(chenFrames != 0) {
 				if(frames % chenFrames == 0) sp += chenSp;
 			}

 			if(archettoFrames != 0) {
 				if(frames % archettoFrames == 0) sp += 1;
 			}

 			if(sp >= spCost) break;
 		}

 		// console.log('normal atk frames', normalAtkFrames);
 		// console.log('frames', frames);
 		// console.log('calc', frames / 30);
 		return frames / 30;
 	}

	function calculateDps(operator, targetWidget) {
		var baseAtk;
		var baseDef;
		var baseAspd = 1;
		var baseAtkInterval;
		var baseDefPen = 1;
		var baseDefFlatPen = 0;
		var baseResPen = 1;
		var baseResFlatPen = 0;
		var baseDefIgnore = 1;
		var baseResIgnore = 1;
		var baseDefFlatIgnore = 0;
		var baseResFlatIgnore = 0;
		var baseBlock;
		var baseMaxTarget = 1;
		var baseSP = 1;
		var spRecoveryTime;
		var skillDps;
		var skillTotalDamage = 0;

		var enemyDef = document.getElementById('enemyDef').value;
		var enemyRes = document.getElementById('enemyRes').value;
		var enemyCount = document.getElementById('enemyNum').value;

		var flatAtkBuff = document.getElementById('flatAtkBuff').value;
		var percentAtkBuff = document.getElementById('percentAtkBuff').value;
		var aspdBuff = document.getElementById('aspdBuff').value;
		var damageScaleBuff = document.getElementById('dmgScaleBuff').value;
		var spRechargeBuff = document.getElementById('spRechargeBuff').value;

		var elite = document.getElementById(targetWidget + 'Promotion').value;
		var level = document.getElementById(targetWidget + 'Level').value;
		var pot = document.getElementById(targetWidget + 'Potential').value;
		var trust = document.getElementById(targetWidget + 'Trust').value;
		var mod = document.getElementById(targetWidget + 'Module').value;
		var skill = document.getElementById(targetWidget + 'Skill').value;
		var skillRank = document.getElementById(targetWidget + 'SkillRank').value;

		//-----------------------------------------------------------------------------------------
		// actual calculations below

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
		if(operator.subclass == 'fighter') baseAtkInterval = 0.767;
		baseBlock = operator.promoStats[elite].attributesKeyFrames[0].data.blockCnt;

		// calculate potential stats increase
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

		// module flat stat increase
		if(operator.module.length != 0 && mod != 'basicMod') {
			var modNum = mod[0];
			var modLevel = mod[1];
			var modBlackboard = operator.modStats[modNum].phases[modLevel].attributeBlackboard;

			for(var i = 0; i < modBlackboard.length; i++) {
				if(modBlackboard[i].key == 'atk')
					baseAtk += modBlackboard[i].value;
				if(modBlackboard[i].key == 'attack_speed')
					baseAspd += modBlackboard[i].value / 100;
				if(modBlackboard[i].key == 'def')
					baseDef += modBlackboard[i].value;
			}
		}

		// load correct talent
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

		// calculate skill settings
		var skillDuration;
		var skillInfinite = false;
		var skillCost;
		var skillRecoveryType = 'natural'
		var skillArr = [];
		var selectedSkill;
		var skillId;

		for(var i = 0; i < operator.skills.length; i++) {
			if(operator.skills[i].levels[0].name == skill) {
				selectedSkill =  operator.skills[i].levels[skillRank - 1];
				skillId = operator.skills[i].skillId;
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


		// HARD CODE-----------------------

		if(skillId == 'skchr_chen_2') skillDuration = 1.3333;
		if(skillId == 'skchr_chen_3') skillDuration = 3.4;


		// END HARD CODE-------------------

		
		var normalDamageType = 'physical';
		var atkUp = 1;
		var defUp = 1;
		var atkScale = 1;
		var damageScale = 1;
		var aspd = baseAspd;
		var atkInterval = baseAtkInterval;
		var atkUpArr = ['atk', 'phenxi_t_1[peak_2].peak_performance.atk', 'peak_performance.atk'];
		var atkScaleArr = ['atk_scale'];
		var aspdArr = ['min_attack_speed', 'attack_speed'];
		var talentProb;

		if(operator.class == 'CASTER' || operator.subclass == 'artsfghter' || (operator.class == 'SUPPORT' && operator.subclass != 'craftsman'))
			normalDamageType = 'arts';

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
				else if(talentArr[i][j][0] == 'magic_resist_penetrate_fixed')
					baseResFlatIgnore += talentArr[i][j][1];
				else if(talentArr[i][j][0] == 'prob')
					talentProb = talentArr[i][j][1];
			}
		}

		if(operator.name == 'Mountain') atkUp = 1;


		var baseNormalAtk = baseAtk * atkUp;
		var normalAtk;

		var normalAtkInterval;
		var normalAtkFrames;
		var normalDps;

		// Naughty list
		var talentExceptions = ['Mountain', 'Bagpipe', 'Meteorite', 'Mousse', 'Irene', 'Franka', 'Indra'];
		var crits = ['Meteorite', 'Indra', 'Mountain', 'Bagpipe'];

		//calculate talent effects on normal attacks
		if(talentExceptions.includes(operator.name)) {
			if(crits.includes(operator.name)) {
				normalAtk = baseAtk - (clamp((clamp(enemyDef, baseDefFlatPen) * baseDefPen), baseDefFlatIgnore) * baseDefIgnore);
				critAtk = baseAtk * atkUp * atkScale - (clamp((clamp(enemyDef, baseDefFlatPen) * baseDefPen), baseDefFlatIgnore) * baseDefIgnore);

				if(operator.name == 'Bagpipe' && enemyCount > 1) critAtk *= 2;

				normalAtk = (normalAtk * (1 - talentProb) + critAtk * (talentProb));
				normalAtkInterval = atkInterval / aspd;
				normalAtkFrames = Math.round(30 * normalAtkInterval);
				normalDps = Math.round(((normalAtk * damageScale) / normalAtkFrames) * 30);
			}
		}
		else {
			if(normalDamageType == 'physical')
				normalAtk = baseNormalAtk * atkScale - (clamp((clamp(enemyDef, baseDefFlatPen) * baseDefPen), baseDefFlatIgnore) * baseDefIgnore);
			else if(normalDamageType == 'arts')
				normalAtk = baseNormalAtk * atkScale * (1 - ((clamp((clamp(enemyRes, baseResFlatPen) * baseResPen), baseResFlatIgnore) * baseResIgnore) / 100));
			else
				normalAtk = baseNormalAtk * atkScale;

			if(normalAtk < (baseNormalAtk * atkScale) * 0.05) normalAtk = (baseNormalAtk * atkScale) * 0.05;

			normalAtkInterval = atkInterval / aspd;
			normalAtkFrames = Math.round(30 * normalAtkInterval);
			normalDps = Math.round(((normalAtk * damageScale) / normalAtkFrames) * 30);
		}

		if(operator.subclass == 'sword') normalDps *= 2;


		// calculate offtime
		var skillOfftime;
		if(skillDuration == 0) skillDuration = atkInterval;
		if(skillRecoveryType == 'natural')
			skillOfftime = skillCost;
		else if(skillRecoveryType == 'attack')
			skillOfftime = (normalAtkFrames * skillCost) / 30;
		else if(skillRecoveryType == 'defense')
			skillOfftime = skillCost / 0.75;

		// HARD CODE---------------------

			// function atkRecoverySim(normalAtkFrames, spCost, chenBonus, chenSp, archettoBonus)

		if(operator.name == 'Ch\'en' && elite == 1 && mod == 'basicMod')
			skillOfftime = atkRecoverySim(normalAtkFrames, skillCost, 5, 1, 0);

		if((operator.name == 'Ch\'en' && elite == 2 && mod == 'basicMod') || (operator.name == 'Ch\'en' && elite == 2 && modNum == 0 && modLevel == 0))
			skillOfftime = atkRecoverySim(normalAtkFrames, skillCost, 4, 1, 0);

		if(operator.name == 'Ch\'en' && modNum == 0 && modLevel == 1)
			skillOfftime = atkRecoverySim(normalAtkFrames, skillCost, 3, 1, 0);

		if(operator.name == 'Ch\'en' && modNum == 0 && modLevel == 2)
			skillOfftime = atkRecoverySim(normalAtkFrames, skillCost, 3, 2, 0);


		// END HARD CODE-----------------

		var skillDamageType = 'physical';
		var skillAtkUp = 1;
		var skillDefUp = 1;
		var skillAtkScale = 1;
		var skillDamageScale = 1;
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
			else if(atkIntervalArr.includes(skillBlackboard[i].key)) {
				if(skillId == 'skchr_shwaz_3') skillAtkInterval += 0.4;
				else skillAtkInterval *=  1 + skillBlackboard[i].value;
			}
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
			var baseSkillAtk = baseAtk * (atkUp + (skillAtkUp - 1));
			var skillAtk;

			console.log('base skill atk', atkUp, skillAtkUp);

			if(skillDamageType == 'physical')
				skillAtk = baseSkillAtk * atkScale * skillAtkScale - (clamp((clamp(enemyDef, baseDefFlatPen) * baseDefPen), baseDefFlatIgnore) * baseDefIgnore);
			else if(skillDamageType == 'arts')
				skillAtk = baseSkillAtk * atkScale * skillAtkScale * (1 - ((clamp((clamp(enemyRes, baseResFlatPen) * baseResPen), baseResFlatIgnore) * baseResIgnore) / 100));
			else
				skillAtk = baseSkillAtk * atkScale * skillAtkScale;

			if(skillAtk < baseSkillAtk * atkScale * skillAtkScale * 0.05) skillAtk = baseSkillAtk * atkScale * skillAtkScale * 0.05;


			// HARD CODE---------------------

			if(skillId == 'skchr_chen_2') 
				skillAtk += baseAtk * atkScale * skillAtkUp * skillAtkScale * (1 - ((clamp((clamp(enemyRes, baseResFlatPen) * baseResPen), baseResFlatIgnore) * baseResIgnore) / 100));



			var swordXmod1 = ['Ch\'en', 'Tachanka', 'Bibeak'];

			if(swordXmod1.includes(operator.name) && modNum == 0) skillAtk *= 1.1;



			// END HARD CODE-----------------


			skillAtkInterval = skillAtkInterval / skillAspd;
			var skillAtkFrames = Math.round(30 * skillAtkInterval);
			var skillTotalFrames = skillDuration * 30;
			var skillHits = Math.max(Math.round(skillTotalFrames / skillAtkFrames) * skillHitNum, 1);

			// HARD CODE---------------------

			if(skillId == 'skchr_chen_3') skillHits = 10;
			if(operator.name == 'Elysium' || operator.name == 'Myrtle' || operator.name == 'Saileach') skillHits = 0;
			if(skillId == 'skchr_sleach_3') skillHits = 1;
			if(skillId == 'skchr_bpipe_2') skillHits *= 2;
			if(skillId == 'skchr_bpipe_3') skillHits *= 3;
			if(skillId == 'skchr_f12yin_3') skillHits *= 2;

			// END HARD CODE-----------------

			var skillTotalDamage = skillHits * skillAtk * damageScale * skillDamageScale;

			if(crits.includes(operator.name)) {
				var critHits = skillHits * talentProb;
				skillHits -= critHits;
				var tempAtk = baseAtk * skillAtkUp * skillAtkScale  - (clamp((clamp(enemyDef, baseDefFlatPen) * baseDefPen), baseDefFlatIgnore) * baseDefIgnore);
				var tempCrit = baseAtk * atkUp * skillAtkUp * skillAtkScale * atkScale - (clamp((clamp(enemyDef, baseDefFlatPen) * baseDefPen), baseDefFlatIgnore) * baseDefIgnore);
				if(operator.name == 'Bagpipe' && enemyCount > 1) tempCrit *= 2;
				skillTotalDamage = critHits * tempCrit + skillHits * tempAtk;
			}





			var skillDps = Math.round(skillTotalDamage / skillDuration);

			var cycle = skillDuration + skillOfftime;

			if(skillDuration == -1) {
				if(skillId == 'skchr_f12yin_2') skillDuration == 1;
				skillDps = Math.abs(Math.round((skillTotalDamage / skillDuration) / skillAtkInterval));
				var averageDps = skillDps;
			}
			else {
				var offtimeFrames = skillOfftime * 30;
				var normalAtkOfftimeHits = Math.round(offtimeFrames / normalAtkFrames);
				if(operator.subclass == 'sword') normalAtkOfftimeHits *= 2;
				var normalAtkOfftimeDamage = normalAtkOfftimeHits * normalAtk * damageScale;
				var averageDps = Math.round((skillTotalDamage + normalAtkOfftimeDamage) / cycle);
			}
		}

		// console.log('offtime', skillOfftime)
		// console.log('offtime frames', offtimeFrames)
		// console.log(normalAtkOfftimeHits);
		// console.log(normalAtkOfftimeDamage);

		// console.log(normalAtk);
		// console.log(normalAtkFrames);
		// console.log(skillOfftime);
		// console.log('Hits ', skillHits);
		console.log('cycle', cycle);

		if(skillId == 'skchr_f12yin_2') skillDuration = -1;

		if(skillDuration == -1)
			outputDps(targetWidget, baseNormalAtk, normalDps, baseSkillAtk, '∞', skillDps, averageDps);
		else
			outputDps(targetWidget, baseNormalAtk, normalDps, baseSkillAtk, skillTotalDamage, skillDps, averageDps);
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
			<div class="" style="bottom: 0px;">
				<hr/>
				<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
					<span class="display-6" style="font-size: 18px; margin: auto; margin-left: 0px;">Normal Atk Damage:</span>
					<span class="display-6" style="font-size: 18px; margin: auto; margin-right: 0px;">${normalAtk}</span>
				</div>
				<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
					<span class="display-6" style="font-size: 18px; color: #d14b3a; margin: auto; margin-left: 0px;">Normal Atk DPS:</span>
					<span class="display-6" style="font-size: 18px; color: #d14b3a; margin: auto; margin-right: 0px;">${normalDps}</span>
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
					<span class="display-6" style="font-size: 18px; color: #d14b3a; margin: auto; margin-left: 0px;">Skill DPS:</span>
					<span class="display-6" style="font-size: 18px; color: #d14b3a; margin: auto; margin-right: 0px;">${skillDps}</span>
				</div>
				<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
					<span class="display-6" style="font-size: 18px; color: #d14b3a; margin: auto; margin-left: 0px;">Average DPS:</span>
					<span class="display-6" style="font-size: 18px; color: #d14b3a; margin: auto; margin-right: 0px;">${averageDps}</span>
				</div>
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



	$(document).on('change','.cwDropdown', function(e) {
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



	$(document).on('change','.cwInput', function(e) {
		cw1Name = document.getElementById('calcWidget1Name');
		cw2Name = document.getElementById('calcWidget2Name');
		cw3Name = document.getElementById('calcWidget3Name');
		cw4Name = document.getElementById('calcWidget4Name');

		if(cw1Name.innerHTML != '') {
			for(var i = 0; i < dpsData.length; i++) {
				if(cw1Name.innerHTML == dpsData[i].name) {
					calculateDps(dpsData[i], 'calcWidget1');
					break;
				}
			}
		}
		if(cw2Name.innerHTML != '') {
			for(var i = 0; i < dpsData.length; i++) {
				if(cw2Name.innerHTML == dpsData[i].name) {
					calculateDps(dpsData[i], 'calcWidget2');
					break;
				}
			}
		}
		if(cw3Name.innerHTML != '') {
			for(var i = 0; i < dpsData.length; i++) {
				if(cw3Name.innerHTML == dpsData[i].name) {
					calculateDps(dpsData[i], 'calcWidget3');
					break;
				}
			}
		}
		if(cw4Name.innerHTML != '')  {
			for(var i = 0; i < dpsData.length; i++) {
				if(cw4Name.innerHTML == dpsData[i].name) {
					calculateDps(dpsData[i], 'calcWidget4');
					break;
				}
			}
		}
	});

});
