/**
 * OhoToast
 * @version 1.0.0
 * @author UnicornBoast
 * @url https://github.com/unicornboat/oho-toast
 */

/**
 * @constructor
 * @since 1.0.0
 */
function OhoToast () {
	var _this = this;

	this.a_displaying = []; // Array to store all existing toast element ID
	this.n_life = 4000; // Total milliseconds the toast should live
	this.b_paused = false; // Boolean to indicate if mouse if over any toast element
	this.a_stack = []; // Array to store un-pushed messages

	this.n_interval_id = setInterval(function () {
		// Clean expired toasts if mouse is not on any toast element
		if (!_this.b_paused) _this.clean();

		// Display the newly pushed message
		if (_this.a_stack.length) _this.display(_this.a_stack.splice(0, 1));
	}, 10);
}

/**
 * Build toast element
 *
 * @param   {string}      s_html
 * @returns {HTMLElement}
 * @since   1.0.0
 */
OhoToast.prototype.build = function (s_html) {
	var _this = this,
		el_toast = document.createElement('div'),
		el_wrapper = document.createElement('div'),
		el_html = document.createElement('div'),
		el_action = document.createElement('div'),
		el_close = document.createElement('div');

	el_toast.classList.add('oho_toast');
	el_wrapper.classList.add('oho_wrapper');
	el_html.classList.add('oho_html');
	el_action.classList.add('oho_action');
	el_close.classList.add('oho_close');

	el_toast.id = this.randId();
	el_toast.setAttribute('hide', '');
	el_toast.setAttribute('data-created', new Date().getTime());
	el_html.innerHTML = s_html;
	el_close.innerHTML = '⨯';

	// Mouse on any toast element will pause the life checker
	el_toast.onmouseenter = function () {
		_this.b_paused = true;
	};

	// Mouse leave will reactivate the life checker
	el_toast.onmouseleave = function () {
		_this.b_paused = false;
	};

	el_close.onclick = function () {
		_this.destroy(el_toast.id);
	};

	el_action.appendChild(el_close);
	el_wrapper.appendChild(el_html);
	el_wrapper.appendChild(el_action);
	el_toast.appendChild(el_wrapper);

	this.a_displaying.push(el_toast.id);
	return el_toast;
};

/**
 * Clean expired toast
 * @since 1.0.0
 */
OhoToast.prototype.clean = function () {
	for (var n_i = 0; n_i < this.a_displaying.length; n_i ++) {
		var el_t = document.getElementById(this.a_displaying[n_i]),
			n_ts = parseInt(el_t.getAttribute('data-created'));
		if (new Date().getTime() - n_ts > this.n_life) {
			this.destroy(this.a_displaying[n_i]);
		}
	}
};

/**
 * Remove toast from DOM
 *
 * @param {string} s_id
 * @since 1.0.0
 */
OhoToast.prototype.destroy = function (s_id) {
	var _id, _this = this,
		el_toast = document.getElementById(s_id);
	if (el_toast) {
		el_toast.setAttribute('hide', '');
		_id = setTimeout(function () {
			if (el_toast.parentElement && el_toast) {
				// Remove as a child element if its parent element exists
				el_toast.parentElement.removeChild(el_toast);
			} else if (el_toast) {
				// Remove itself
				el_toast.remove();
			}

			// Remove the element ID from the displaying array
			_this.a_displaying = _this.a_displaying.filter(function (s_each_id) {
				return s_each_id !== s_id;
			});

			// Re-position all displaying toasts
			_this.position();

			// Clear the timer
			clearTimeout(_id);
		}, 200);
	}
};

/**
 * Populate toast element in DOM
 *
 * @param {string} s_html
 * @since 1.0.0
 */
OhoToast.prototype.display = function (s_html) {
	var el_toast = this.build(s_html);
	document.body.insertAdjacentElement('beforeend', el_toast);

	this.position();
	setTimeout(function () {
		el_toast.removeAttribute('hide');
	}, 200);
};

/**
 * Position all displaying toast elements
 *
 * @param {string} s_html
 * @since 1.0.0
 */
OhoToast.prototype.position = function (s_html) {
	for (var n_i = 0; n_i < this.a_displaying.length; n_i ++) {
		var el_t = document.getElementById(this.a_displaying[n_i]),
			n_m = this.a_displaying.length - n_i,
			o_rect = el_t.getBoundingClientRect(),
			n_bottom = (o_rect.height + (n_m > 1 ? 10 : 0)) * n_m;
		el_t.style.setProperty('bottom', n_bottom + 'px');
	}
};

/**
 * Push a new toast to DOM
 *
 * @param {string} s_html
 * @since 1.0.0
 */
OhoToast.prototype.push = function (s_html) {
	if (typeof s_html === 'string' && s_html.trim() !== '') {
		this.a_stack.push(s_html);
	}
};

/**
 * Generate random hex string
 * @returns {string}
 * @since   1.0.0
 */
OhoToast.prototype.randId = function () {
	var a_chars = 'abcdef0123456789', s_id = '____ot_';
	for (var n_i = 0; n_i < 16; n_i ++) {
		s_id += a_chars[Math.floor(Math.random() * a_chars.length)];
	}
	return s_id;
};

/**
 * Add minified style sheet to document head
 * This runs only once when this file is loaded in DOM
 */
document.addEventListener('DOMContentLoaded', function (e) {
	var s_id = 'oho_toast_style_sheet';
	if (!document.getElementById(s_id)) {
		var el_style_sheet = document.createElement('style');
		el_style_sheet.id = s_id;
		el_style_sheet.innerHTML = '.oho_toast{position:fixed;left:20px;bottom:40px;font-size:14px;opacity:1;-webkit-transition:bottom .2s ease-out;-o-transition:bottom .2s ease-out;transition:bottom .2s ease-out;z-index:2147483647}.oho_toast[hide]{opacity:0}.oho_countdown,.oho_wrapper{-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-box;display:-ms-flexbox;display:flex}.oho_close,.oho_countdown{position:absolute;top:0;left:0;right:0;bottom:0;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}.oho_wrapper{-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);background-color:rgba(0,0,0,.6);border-radius:10px;-webkit-box-shadow:0 3px 15px 0 rgba(0,0,0,.2),0 10px 10px 0 rgba(0,0,0,.1);box-shadow:0 3px 15px 0 rgba(0,0,0,.2),0 10px 10px 0 rgba(0,0,0,.1);color:#fff;line-height:18px;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;overflow:hidden;padding:20px;width:200px}.oho_html{margin-right:10px;pointer-events:none}.oho_action{position:relative;height:30px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;width:30px}.oho_close{cursor:pointer;font-size:30px;text-align:center}.example{display:-ms-grid;display:grid;-webkit-transition:all .5s;-o-transition:all .5s;transition:all .5s;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background:-webkit-gradient(linear,left top,left bottom,from(white),to(black));background:-o-linear-gradient(top,#fff,#000);background:linear-gradient(to bottom,#fff,#000)}';
		document.head.appendChild(el_style_sheet);
	}
});