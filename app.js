const title = document.getElementById("title");
const nowTime = document.getElementById('time');
const timeType = document.getElementById('timeType');
const textDiv = document.querySelector('.text');
const repBtn = document.getElementById('rpt-btn');
const resetBtn = document.getElementById('reset');
const repTimesContainer = document.querySelector('.rpt-times');
const btns = document.querySelector('.btns');

let repeat = 0;
let nextIndex = 0;


window.addEventListener("DOMContentLoaded", () => {
  const now = new Date();
  let hrs;
  let hours = now.getHours();
  let mins = (now.getMinutes() > 9) ? now.getMinutes() : `0${now.getMinutes()}` ;

  if (hours > 12) {
    hrs = ((hours - 12) > 9 )? hours - 12 : `0${(hours - 12)}`;
  } else {
    hrs = (hours > 9 )? hours : `0${hours}`;
  }

  if (hours >= 15) {
    getText("pm");
    nowTime.textContent = `${hrs}:${mins} م`;
  }
  else if (hours > 12) {
    getText("am");
    nowTime.textContent = `${hrs}:${mins} م`;
    timeType.innerHTML = `<i class="fa-solid fa-sun"></i>`;
  } else {
    getText("am");
    nowTime.textContent = `${hrs}:${mins} ص`;
    timeType.innerHTML = `<i class="fa-solid fa-sun"></i>`;
    title.textContent = "أذكار الصباح";
  }

  resetBtn.addEventListener("click", () => {
    repeat = 0;
    repBtn.textContent = 0;
  })
})




function getText(tm) {
  let xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      let obj =JSON.parse(this.responseText);

      createText(obj[`${tm}`]);

      repBtn.addEventListener('click', () => {
        repeat++;
        repBtn.textContent = repeat;
        checkIfDone(obj[`${tm}`]);
      })
    }
  }

  xhr.open('GET', './data.json', true);
  xhr.send();
}

function createText(obj) {
  obj.forEach((element, index) => {
    let div = document.createElement('div');
    if (index === 0) {
      div.classList.add('active');
      updateTimesNumbers(element.times);
    }
    div.innerHTML = `${element.text} <span>${element.src}</span>`;
    textDiv.appendChild(div);
  });
}

function updateTimesNumbers(times) {
  if (times === 1) {
    repTimesContainer.innerHTML = '<span data-times="1" id="r-times"></span>مرة واحدة';
  }
  else if (times === 2) {
    repTimesContainer.innerHTML = '<span data-times="2" id="r-times"></span>مرتان';
  }
  else if (times <= 10) {
    repTimesContainer.innerHTML = `<span id="r-times">${times}</span> مرات`;
  } else {
    repTimesContainer.innerHTML = `<span id="r-times">${times}</span> مرة`;
  }
}

function checkIfDone(obj) {
  let times = document.getElementById('r-times');
  let max;

  if (times.textContent === "") {
    max = times.dataset.times;
  } else {
    max = times.textContent;
  }
  
  if (repeat == max) {
    nextText(obj);
  }
  
}

function nextText(obj) {
  let list = [...textDiv.children];

  if ((nextIndex + 1) < list.length) {
    list.forEach((item, index) => {
      if (item.classList.contains('active')) {
          item.classList.add('done');
          item.classList.remove('active');
          nextIndex = index + 1;
          reset();
          updateTimesNumbers(obj[nextIndex].times)
        }
    })
    list[nextIndex].classList.add('active');
  }
  else {
    endTheApp();
  }
}

function reset() {
  repeat = 0;
  repBtn.textContent = 0;
}

function endTheApp() {
  textDiv.innerHTML = "أحسنت, لقد أكملت أذكارك"
  btns.innerHTML = "حفظك الله وبارك فيك";
}
