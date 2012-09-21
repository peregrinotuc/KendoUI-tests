var app;

$(document).ready(function () {

	$.support.cors = true;

	var documents = [];
	var ds_unsigned;
	var ds_urgent;
	var ds_signed;
	
	// cannot load complex data (object, array) directly in a DataSource... retrieve them locally then create separate DataSource 
	$.getJSON( 'http://demo.finsa.it/wsDigitalSignMobile/GetDocsAndInfos/lucab', 
		function(data) {
			documents = data;
		}	
	)
	.error(function() { alert("JSON error"); })
	.complete(function() {
		ds_unsigned = new kendo.data.DataSource({data: documents.unsignedRegularDocs});
		ds_unsigned.read();
		ds_urgent = new kendo.data.DataSource({data: documents.unsignedUrgentDocs});
		ds_urgent.read();
		ds_signed = new kendo.data.DataSource({data: documents.signedDocs});
		ds_signed.read();

		initList($('#unsignedRegularDocs'), ds_unsigned, '0');
		initList($('#unsignedUrgentDocs'), ds_urgent, '1');
		initList($('#signedDocs'), ds_signed, '2');
	});
	
	// show page
	$('#list\\_view').show();
	$('#list\\_view').css("opacity",1);

});

function escapeId(myid) { 
   return '#' + myid.replace(/(:|\.)/g,'\\$1');
}

function initList(list, datasource, doctype)
{
	list.kendoMobileListView({
		template: "<a href='\\#scrollview-home' id='#:data#'>#:data#</a>",
		dataSource: datasource,
		click: function(e) {
			app.showLoading();
			$("#scrollview\\-container").css("display", "none");
			var docid = $(e.target).text().slice(0,-4);
			var url = 'http://demo.finsa.it/wsDigitalSignMobile/GetDocPages/lucab/' + doctype + '/' + docid;
			$.getJSON(url,
				function(png){
					var html = [];
					$.each(png, function(key, val){
						var pngid = docid + key;
						html.push('<div data-role="page"><img id="'+pngid+'" src="data:image/png;base64,'+val+'"/></div>');
					});					
					$("#pdf\\-container").data("kendoMobileScrollView").content(html.join(''));
				}
			)
			.complete(function() {
				$("#scrollview\\-container").css("display", "block");
				$('#pdf\\-container').data("kendoMobileScrollView").refresh();
				$("#pdf\\-container").data("kendoMobileScrollView").scrollTo(0);
				app.hideLoading();
			})
			.error(function() { alert("JSON error - URL: " + url); });
		}
	});
}

function closeModalViewFav() {
    $("#modalview\\-fav").kendoMobileModalView("close");
}
