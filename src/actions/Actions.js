export function toggleMobileNav(showMobileNav) {
	return new Promise((resolve, reject) => {
		let newState = {};

		showMobileNav = (typeof showMobileNav == 'undefined') ? !this.state.showMobileNav : showMobileNav;

		if (!showMobileNav && this.state.showProductsMenu) {
			newState = {
				showProductsMenu: false
			};
		} else {
			newState = {
				showMobileNav: showMobileNav,
			};
		}

		this.setState(newState, () => resolve());
	});
}

export function toggleProductsMenu() {
	this.setState({
		showProductsMenu: !this.state.showProductsMenu
	});
}

export function toggleShowPullCommands() {
	this.setState({
		showPullCommands: !this.state.showPullCommands,
		showEmailSignUp: false,
	});
}

export function toggleShowEmailSignUp(demoType = null) {
	this.setState({
		showEmailSignUp: !this.state.showEmailSignUp,
		showPullCommands: false,
		demoType: demoType
	});
}

export function closeAll() {
	this.setState({
		showEmailSignUp: false,
		showPullCommands: false,
	});
}


export function updateSignUpField(prop, e, eIsValue) {
	let value = (eIsValue) ? e : e.target.value;

	this.setState({
		signUpError: '',
		signUpSuccess: false,
		emailForm: {
			...this.state.emailForm,
			[prop]: value
		}
	});
}


export function resetSignUpState() {
	this.setState({
		emailForm: {},
		signUpError: '',
		signUpSuccess: false,
		signUpXHR: false
	});
}


export function sendSignUpRequest() {
	return new Promise((resolve, reject) => {
		this.setState({
			signUpXHR: true
		}, () => {
			let postData = {
				...this.state.emailForm,
				productType: 'All'
			}

			let url = '/ab999dst/demo?' + serializeObject(postData);

			let request = new Request(url, {
				method: 'GET',
				mode: 'cors',
			});

			fetch(request)
				.then((response) => {
					let json;

					try {
						json = response.json();
					} catch (e) {
						return Promise.reject.bind(Promise);
					}

					if (response.status >= 200 && response.status < 300) {
						return json;
					} else {
						return json.then(Promise.reject.bind(Promise));
					}
				})
				.then((res) => {
					this.setState({
						signUpSuccess: true,
						signUpXHR: false,
						signUpError: ''
					}, () => resolve());
				})
				.catch((err) => {
					console.error(err);
					this.setState({
						signUpSuccess: false,
						signUpXHR: false,
						signUpError: err.errorMsg || 'Unable to Sign Up.'
					}, () => resolve());
				});

		});
	});
}

function serializeObject(object) {
	var holder = [];
	for (var key in object) {
		if (object.hasOwnProperty(key)) {
			holder.push((encodeURIComponent(key) + '=' + encodeURIComponent(object[key])));
		}
	}
	return holder.join('&');
}
