var Metronome = {
	interval: null,

	beat: 0,

	time: parseInt(document.getElementById('time').value),

	context: new(window.audioContext || window.webkitAudioContext),

	tick: function() {
		var osc = Metronome.context.createOscillator();

		osc.type = 'sine';
		osc.frequency.value = 2640; // 440 * 6
		osc.connect(Metronome.context.destination);

		if (Metronome.time === 0) { // no time signature, just play the tick and increment the beat indefinitely
			Metronome.beat++;
		} else if ((Metronome.beat < Metronome.time) && (Metronome.beat % Metronome.time > 0)) {
			Metronome.beat++;
		} else {
			Metronome.beat = 1;
			osc.frequency.value = 3520; // 440 * 8
		}

		document.getElementById('visual-target').innerHTML = Metronome.beat;

		if (!document.getElementById('mute').checked) {
			osc.noteOn(0);

			setTimeout(function() {
				osc.noteOff(0);
			}, 20);
		}

		console.log('tick');
	},

	start: function() {
		var bpm = document.getElementById('bpm').value;
		var beepInterval = (60 / bpm) * 1000;
		if(bpm > 0) {
			if (Metronome.interval !== null) window.clearInterval(Metronome.interval);
			Metronome.interval = window.setInterval(Metronome.tick, beepInterval);
			//Metronome.tick(); // unless we call this now, we wait until beepInterval has passed before the first tick comes
			document.getElementById('start').style.display = 'none';
			document.getElementById('stop').style.display = '';
			console.log('metronome started');
		} else {
			console.log('bpm must be positive', bpm); // TODO tell user
		}
	},

	stop: function() {
		window.clearInterval(Metronome.interval);
		Metronome.interval = null;
		Metronome.beat = 0;
		document.getElementById('visual-target').innerHTML = '';
		document.getElementById('start').style.display = '';
		document.getElementById('stop').style.display = 'none';
		console.log('metronome stopped');
	},

	restart: function() {
		Metronome.stop();
		Metronome.start();
	},

	addToBpm: function(difference) {
		var bpmInput = document.getElementById('bpm');
		bpmInput.value = parseInt(bpmInput.value) + difference;
		if (Metronome.interval !== null) Metronome.start();
	},

	init: function() {
		document.getElementById('stop').style.display = 'none';

		document.getElementById('bpm').onkeyup = Metronome.restart;
		document.getElementById('start').onclick = Metronome.start;
		document.getElementById('stop').onclick = Metronome.stop;

		document.getElementById('time').onkeyup = function(){
			// TODO error handling for non-integers
			// TODO support input like "2+3" for 5/4
			Metronome.time = parseInt(this.value);
		}

		document.getElementById('minus10').onclick = function(){
			Metronome.addToBpm(-10);
		}
		document.getElementById('minus1').onclick = function(){
			Metronome.addToBpm(-1);
		}
		document.getElementById('plus10').onclick = function(){
			Metronome.addToBpm(10);
		}
		document.getElementById('plus1').onclick = function(){
			Metronome.addToBpm(1);
		}
	}
}

Metronome.init();
