function logMeOut() {
	alert("Logged out");
	localStorage.removeItem('token');
	return true;
}