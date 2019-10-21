// settings
let testFileSizeByte = 10; // MB
let testFilePath = `./${testFileSizeByte}MB.file`;
let testFileSize = testFileSizeByte * 8;

// global vars
let proc = false; // テスト継続フラグ
let log = []; // テスト結果を入れていくところ

let testTimes = 3;
let times = 1;


// main
const download = () => {
  var startT = new Date();
  var endT, msec, speed, average;

  $.get(`${testFilePath}?time=${new Date().getTime()}`).done(() => {
    endT = new Date();
    msec = endT.getTime() - startT.getTime();

    // 現在のスピード
    speed = Number((testFileSize / (msec / 1000)).toFixed(2));
    $('#speed').text(`${speed} Mbps`);
    log.push(speed);

    // 平均値
    average = log.reduce((acc, cur) => cur + acc) / log.length;
    average = Number(average.toFixed(2));
    $('#average').text(`${average} Mbps`);

    // 配列が長くなりすぎないように
    if (log.length > 49) log.pop();

    // 続けていい？
    if (testTimes === 0 || testTimes > times) {
      times += 1;
      if (proc) download();
      else {
        $('#start, #stop').removeClass('is-loading');
        proc = false;
      }
    }
    else {
      $('#start, #stop').removeClass('is-loading');
      proc = false;
    }
  }).fail(jqXHR => {
    proc = false;
    $('#start, #stop').removeClass('is-loading');
    alert(`error: ${jqXHR.status}`);
  });
};


// Event Handlers
$('#start').on('click', () => {
  if (proc) return;
  times = 1;
  log = [];
  proc = true;
  download();
  $('#start').addClass('is-loading');
});

$('#stop').on('click', () => {
  if (!proc) return;
  proc = false;
  $('#stop').addClass('is-loading');
});

$('input[name="size"]').on('change', function () {
  // console.log(`size changed: ${$(this).val()}`);
  testFileSizeByte = Number($(this).val());
  testFilePath = `./${testFileSizeByte}MB.file`;
  testFileSize = testFileSizeByte * 8;
});

$('input[name="times"]').on('change', function () {
  // console.log(`times changed: ${$(this).val()}`);
  testTimes = Number($(this).val());
});