;
(function($) {
	$.fn.extend({
		serializeObj : function() {
			var obj = {};
			$.each(this.serializeArray(), function(id, e) {
				if (obj[e['name']]) {
					obj[e['name']] = obj[e['name']] + "," + e['value'];
				} else {
					obj[e['name']] = e['value'];
				}
			});
			//alert(JSON.stringify(obj));
			return obj;
		}
	});
})(jQuery);