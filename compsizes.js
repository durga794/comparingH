//The Image Panel

var figshow = document.getElementById('FigureDisplay');

//  Enable Extra Figures

var figform = document.getElementById('Figures');
figform.FigTbls = document.getElementById('HeightFields').getElementsByTagName('fieldset');
figform.Figures = new Array();
figform.size_code = figform.Size_Code.getAttribute('value');

var var_url = document.URL;
var var_base_url = var_url.split('?')[0];

function Figure(fform, num){
	var v_figid = 'Fig'+num.toString();
	var v_fig = {
		p:new Object(),
		m:new Object()
	};
	//Figure Attributes
	v_fig.p.num = num;
	v_fig.p.scale = 1;
	v_fig.p.vert_pos = 571 - (571 * v_fig.p.scale);
	v_fig.p.horz_pos = 200 * (num-1);
	v_fig.p.type = 'male';
	// Figure Display
	// -- Get Figures
	v_fig.p.male = document.getElementById('Def_Man').cloneNode(true);
	v_fig.p.male.removeAttribute('id');
	v_fig.p.female = document.getElementById('Def_Woman').cloneNode(true);
	v_fig.p.female.removeAttribute('id');
	
	// -- Create setup
	v_fig.p.fig_store = document.createElement('js_storage');  //(Not part of the document tree.)
	
	v_fig.p.figure = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	v_fig.p.figure.setAttribute('class','fig_'+num.toString());
	v_fig.p.figure.setAttribute('transform','translate('+v_fig.p.horz_pos+', 0)');
	v_fig.p.figure.setAttribute('js_tracker','Figure Main');
	// -- Set name
	v_fig.p.figure_name_cont = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	v_fig.p.figure_name_cont.setAttribute('x','0');
	v_fig.p.figure_name_cont.setAttribute('y','590');
	v_fig.p.figure_name_cont.setAttribute('js_tracker','Figure Name Container');
	v_fig.p.figure.appendChild(v_fig.p.figure_name_cont);
	
	v_fig.p.figure_name = document.createTextNode('Figure '+num.toString());
	v_fig.p.figure_name_cont.appendChild(v_fig.p.figure_name);
	
	v_fig.p.figure_cont=document.createElementNS('http://www.w3.org/2000/svg', 'g');
	v_fig.p.figure_cont.appendChild(v_fig.p.male);
	v_fig.p.figure_cont.setAttribute('js_tracker','Figure Image Container');
	
	v_fig.p.figure.appendChild(v_fig.p.figure_cont);
	
	// Figure Controls
	v_fig.p.inp_panel = document.getElementById(v_figid);
	v_fig.p.figname_inp = fform[v_figid+'Name'];
	v_fig.p.figname_inp.onchange = function(){
		SetName(v_fig);
	}
	function SetName(fig){
		fig.p.figure_name.data = fig.p.figname_inp.value;
	}
	v_fig.m.SetName = SetName;
	
	v_fig.p.figtype_inp = fform[v_figid+'Type'];
	for(var i = 0; i < v_fig.p.figtype_inp.length; i++){
		v_fig.p.figtype_inp[i].onclick = function (i, v_fig){return function(){
			SetType(v_fig.p.figtype_inp[i].value, v_fig);
		}}(i, v_fig);
	}// */
	function SetType(ftype, fig){
		fig.p.fig_store.appendChild(fig.p.figure_cont.firstChild);
		fig.p.figure_cont.appendChild(fig.p[ftype]);
		fig.p.type=ftype;
	}
	v_fig.m.SetType=SetType;
	
	function SetStatus(fig, fig_disp, stat){
		fig.p.inp_panel.className=stat;
		var inps = fig.p.inp_panel.getElementsByTagName('input');
		for(var i = 0; i < inps.length; i++){
			inps[i].disabled=(stat=='disabled');
		}
		if(stat=='enabled' && !(fig_disp.contains(fig.p.figure))){
			fig_disp.appendChild(fig.p.figure);
		}
		if(stat=='disabled' && fig_disp.contains(fig.p.figure)){
			fig_disp.removeChild(fig.p.figure);
		}
	}
	v_fig.m.SetStatus = SetStatus;
	
	//Set Measurements
	v_fig.p.feet = fform[v_figid+'Ft'];
	v_fig.p.inches = fform[v_figid+'In'];
	v_fig.p.centims = fform[v_figid+'Cm'];
	
	function ToMetric(fig){
		fig.p.centims.value = (((Number(fig.p.feet.value)*12) + Number(fig.p.inches.value))*2.54).toFixed(1);
	}
	function ToImperial(fig){
		var lngth_ins = Math.round(Number(fig.p.centims.value)/2.54);
		fig.p.feet.value = (Math.floor(lngth_ins/12)).toString();
		fig.p.inches.value = (lngth_ins % 12).toString();
	}
	v_fig.m.ToImperial=ToImperial;
	v_fig.p.inches.onchange = function(){
		if(v_fig.p.inches.value > 11){
			v_fig.p.feet.value = (Math.floor(Number(v_fig.p.inches.value)/12) + Number(v_fig.p.feet.value)).toString();
			v_fig.p.inches.value = (Number(v_fig.p.inches.value) % 12).toString();
			
		}
		ToMetric(v_fig);
		Resize(fform);
	}
	v_fig.p.feet.onchange = function(){
		ToMetric(v_fig);
		Resize(fform);
	}
	v_fig.p.centims.onchange = function(){
		ToImperial(v_fig);
		
		Resize(fform);
	}
	
	function ScaleFig(fig){
		fig.p.figure_cont.setAttribute('transform', 'translate('+fig.p.vert_pos.toString()+', '+(571 - (571 * fig.p.scale)).toString()+') scale('+fig.p.scale.toString()+')');
	}
	v_fig.m.ScaleFig=ScaleFig;

	
	this.p = v_fig.p;
	this.m = v_fig.m;
}

for(var i=1; i <= figform.FigTbls.length; i++){figform.Figures.push(new Figure(figform, i));}

figshow.appendChild(figform.Figures[0].p.figure);
figshow.appendChild(figform.Figures[1].p.figure);

for(var i=0; i< figform.FigCount.length; i++){
	figform.FigCount[i].onclick = function(i, figform){return function(){
		for(var ii=0; ii < figform.Figures.length; ii++){
			figger=figform.Figures[ii];
			figger.m.SetStatus(
				figger, 
				figshow, 
				((Number(figform.FigCount[i].value) >= figger.p.num)?'enabled':'disabled')
			)
		}
		Resize(figform);
	}}(i, figform);
}
function Resize(fgform){
	var sizes = new Array();
	for(var i = 0; i < fgform.Figures.length;i++){
		if(fgform.Figures[i].p.inp_panel.className == 'enabled'){
			sizes.push(Number(fgform.Figures[i].p.centims.value));
		}
	}
	var base_size = Math.max.apply(Math,sizes);
	for(var i = 0; i < fgform.Figures.length; i++){
		fgform.Figures[i].p.scale = Number(fgform.Figures[i].p.centims.value)/base_size;
		fgform.Figures[i].m.ScaleFig(fgform.Figures[i]);
	}
}

//  Size Code

figform.Get_Code.onclick = function(){
	var code = '';
	for(var i = 0; i < figform.Figures.length;i++){
		if(figform.Figures[i].p.inp_panel.className == 'enabled'){
			if(i > 0){
				code +='_';
			}
			var figger = figform.Figures[i];
			code += 
				figger.p.figname_inp.value + '~' + 
				figger.p.type + '~' +
				figger.p.centims.value + 
			'';
		}
	}
	figform.Size_Code.value = code;
	figform.Size_URL.value = var_base_url + '?' + code;
}

figform.Use_Code.onclick = function(){
	var codes = figform.Size_Code.value.split('_');
	UseCode(figform, codes);
}

function UseCode(fgfrm, cds){
	fgfrm.FigCount.value=cds.length;
	var i = 0;
	while(i < cds.length){
		var figger=fgfrm.Figures[i];
		figger.m.SetStatus(figger, figshow, 'enabled');
		var fig_infs = cds[i].split('~');
		figger.p.figname_inp.value = fig_infs[0];
		figger.m.SetName(figger);
		figger.p.figtype_inp[0].checked = (figger.p.figtype_inp[0].value == fig_infs[1]);
		figger.p.figtype_inp[1].checked = (figger.p.figtype_inp[1].value == fig_infs[1]);
		figger.m.SetType(fig_infs[1], figger);
		figger.p.type=fig_infs[1];
		figger.p.centims.value =fig_infs[2];
		figger.m.ToImperial(figger);
		i++;
	}
	while(i < fgfrm.Figures.length){
		var figger=fgfrm.Figures[i];
		figger.m.SetStatus(figger, figshow, 'disabled');
		i++;
	}
	Resize(fgfrm);
}


if(var_url.indexOf('?') > -1){
	var scode = var_url.split('?')[1]
	var scodes = scode.split('_');
	UseCode(figform, scodes);
	figform.Size_Code.value = scode;
	figform.Size_URL.value = var_url;

}