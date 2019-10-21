let proc = false; // テスト継続フラグ
const log = []; // テスト結果を入れていくところ
const testFileSize = 80; // Mbit
const testFilePath = './10MB.file'; // ダウンロードするファイルのパス

var download = () => {
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
    if (log.length > 19) log.pop();

    // 続けていい？
    if (proc) download();
    else $('#start').removeClass('is-loading');

  }).fail(jqXHR => {
    alert(`error: ${jqXHR.status}`);
  });
};

$('#start').on('click', () => {
  if (proc) return;
  proc = true;
  download();
  $('#start').addClass('is-loading');
});

$('#stop').on('click', () => {
  proc = false;
});