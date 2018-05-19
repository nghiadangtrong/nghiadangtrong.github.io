window.onload = function(){
	document.querySelector('.menu-right').addEventListener('click', function(){
		if(screen.width > 992){
			this.classList.remove('activity');
		}else{
			this.classList.toggle('activity');
		}
	});

	
	setTimeout(function(){
		console.log(screen.width);
	}, 3000);
};