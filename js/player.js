
var default_config = {
settings: {
shuffle_sections: false,
shuffle_questions: true,
shuffle_choices: true,
passing_score: 80,
id_prefix: 'q',
id_digits: 3,
time_limit: 0,
time_limit_mode: 'total',
tag_visible: true,
show_correct_answer: true,
show_instant_result: true,
show_seigo_count: true,
hide_result_summary: false,
hide_result_detail: false,
hide_mark_button: true,
hide_list_button: false,
hide_pagination: false,
title: 'Quiz',
ignore_case: true,
ignore_whitespace_count: true,
ignore_whitespace: false,
ignore_zenhan: true,
trim: true,
width: false,
height: false,
bgcolor: false,
player_bgcolor: false,
finish_at_result_page: true,
movable: false,
mode: 'master',
layout: 'normal',
master_count: 2,
weak_count: 5,
restartable: true,
display_results_at_start: false,
show_answers_so_far: false,
show_a_look_back: false,
scorm: 'auto',
scale: 1,
student_response_align: 'center',
flexible_resultpage: false,
version: '5.16.18',
remove_powered_by: false,
sound: false,
math: true,
certificate: false,
pass: false,
score_weighting: false,
suspendable: false,
suspendable_count: -1,
show_suspendable_button: true,
partial_score: false,
autoplay: false,
background_audio_playback: true,
use_number_type_for_input: true,
fill_in_max_length: '',
allow_submission_without_answer: false,
rounding_setting_of_score: 'rounddown',
messages: {
passed: 'Completed!',
incomplete: 'Ongoing',
failed: 'Failed',
sankaku: 'Partial scores',
completed: 'Waiting for scoring',
correct: 'Correct!',
incorrect: 'Incorrect',
neutral: 'Waiting for scoring',
not_selected: 'Please select your answer',
not_filled: 'Please enter your answer',
not_sorted: 'Please put choices in the correct order',
intro: 'Click the "Start" button to begin',
answer_true: 'Completed!',
answer_false: 'Failed',
confirm_midstream_mark: 'You have not answered all quizzes. Are you sure to quit now?',
confirm_mark: 'Are you sure to quit now?',
passed_title: false,
passed_body: false,
failed_title: false,
failed_body: false,
waiting_for_grading_title: false,
waiting_for_grading_body: false
}
},
questions: [
{
question: '<b>What are in the picture?</b> <br>[[images/dice.png]]',
choice: ['dice', 'maze', 'pen'],
answer: 'dice',
type: 'button',
section: 0
},
{
question: '<b>What are in the picture?</b> <br>[[images/dice.png]]',
choice: ['dice', 'maze', 'pen'],
answer: 'dice',
type: 'button',
section: 0
},
{
question: '<b>What are in the picture?</b> <br>[[images/dice.png]]',
choice: ['dice', 'maze', 'pen'],
answer: 'dice',
type: 'button',
section: 0
}
]
};
var scorm12 = { correct: 'correct', incorrect: 'wrong', neutral: 'neutral' },
scorm2004 = {
correct: 'correct',
incorrect: 'incorrect',
neutral: 'neutral'
},
single_choice_template,
single_choice_box_template,
multi_choice_template,
button_template,
input_template,
input_math_template,
textarea_template,
textarea_drawingboard_template,
file_submission_template,
fill_in_multi_template,
true_false_template,
sort_template,
match_template,
wordbank_template,
result_detail_template1,
result_detail_template2,
position = 0,

display_positions = [],
cq,
origProgress,
suspend_data_version = '0020',
suspend_data_body,
suspend_data_body_unknown,
pushed_state,
state = 'loading',
last_button_value = '',
dragging = false,
pc_flg = false,
change_sort_flg = false,
change_list_scale_height = 0,
change_page_scale_height = 0,
finished = false,
_cfg,
suspended = false,
autoStartRunner,
timeLeft = false,
quizUuid,
plan,
preview = false,


previousPosition = 0,

limitedAudioCount = -1,

currentSuspendCount = -1,

suspendDataInitialTimeLimit = null,


studyLogArray = [],

sectionScroll = [],
questionScroll = [],



movableMinSections = [],

isActiveSectionReturnRule = false,


file_submission_messages = {
uploadable_extensions: 'Upload-able file extensions',
not_login: 'The file cannot be uploaded while you do not sign in.',
invalid_extension: 'This file extension is not permitted to upload.',
filename_duplication: 'File name is duplicated.',
size_over: 'Failed to upload the file due to exceeding the file size.',
total_size_over: 'Failed to upload the file due to exceeding the total file size.',
upload_failed: 'Failed to upload the file due to a network error.',
},


originAudioLimitNumMap = {};

function initializeGlobalState() {
position = 0;
display_positions = [];
last_button_value = '';
dragging = false;
pc_flg = false;
change_sort_flg = false;
finished = false;
suspended = false;
timeLeft = false;
preview = false;
previousPosition = 0;
limitedAudioCount = -1;
currentSuspendCount = -1;
suspendDataInitialTimeLimit = null;
studyLogArray = [];
sectionScroll = [];
questionScroll = [];
movableMinSections = [];
isActiveSectionReturnRule = false;
}

window.layout = {
ua: window.navigator.userAgent.toLowerCase(),
os: null,
version: null,
browser: null,
page_quiz: false,
checkBrowser: function () {
if (this.ua.indexOf('msie') !== -1 || this.ua.indexOf('trident') !== -1) {
document.body.classList.add('is-IE');
return 'ie';
}
if (this.ua.indexOf('edge') !== -1) {
document.body.classList.add('is-Edge');
return 'edge';
}
if (this.ua.indexOf('chrome') !== -1) {
document.body.classList.add('is-Chrome');
return 'chrome';
}
if (this.ua.indexOf('safari') !== -1) {
document.body.classList.add('is-Safari');
return 'safari';
}
if (this.ua.indexOf('firefox') !== -1) {
document.body.classList.add('is-Firefox');
return 'firefox';
}
},
checkOS: function () {
if (this.ua.indexOf('windows nt') !== -1) {
document.body.classList.add('windows');
return 'windows';
}
if (this.ua.indexOf('android') !== -1) {
document.body.classList.add('android');
return 'android';
}
if (this.ua.indexOf('iphone') !== -1 || this.ua.indexOf('ipad') !== -1) {
document.body.classList.add('iOS');
return 'iOS';
}
if (this.ua.indexOf('macintosh') > -1 && 'ontouchend' in document) {
document.body.classList.add('iPadOS');
return 'iPadOS'
}
if (this.ua.indexOf('mac os x') !== -1) {
document.body.classList.add('macOS');
return 'macOS';
}
},
checkOSVersion: function () {
const version = this.ua.match(/os (.+?) like/)[1];
return parseFloat(version.replace('_', '.'));
},
choicesAreaWidthAdjust: function () {
const contentWidth = document.querySelector('#contents_wrapper').clientWidth;
const questionWidth = document.querySelector('#question_statement').clientWidth;
const choicesWidth = contentWidth - questionWidth;


const adjustNumber = 30;
const choices = document.querySelector('#choices');
choices.style.height = choicesWidth - adjustNumber + 'px';
},
switchChoicesAreaWidthAdjust: function () {
if (cq.type === 'match' && (this.browser === 'chrome' || this.browser === 'safari')) {
this.choicesAreaWidthAdjust();
window.onresize = this.choicesAreaWidthAdjust;
return;
}
const choices = document.querySelector('#choices');
choices.style.height = '';
window.onresize = null;
},
questionFirstScrolling: function () {
const t = document.querySelector('#question_statement');


if (this.os === 'iOS' || this.browser === 'firefox' || this.browser === 'safari') {
t.scrollLeft = 0;
return;
}
t.scrollLeft = t.scrollWidth;
},
convertTextToAttrDataText: function () {
const nodeList = document.querySelectorAll('.btn-match');
nodeList.forEach(function (t) {
const text = t.innerText;
t.dataset.text = text;
});
},
examFunc: function () {
window.document.body.id = cq.type;
},
examVerticalFunc: function () {
this.examFunc();
const os = this.os;
const browser = this.browser;


if (!this.page_quiz) {
this.page_quiz = true;
setTimeout(function () {
window.layout.switchChoicesAreaWidthAdjust();
}, 10)
} else {
this.switchChoicesAreaWidthAdjust();
}

this.questionFirstScrolling();


if (cq.type === 'match' && (os === 'iOS' || os === 'iPadOS' || browser === 'safari')) {
this.convertTextToAttrDataText();
}
},
createAlertPortrait: function () {
const html = '<div id="alert-portrait" class="alert alert-warning alert-dismissible" role="alert">Smartphones are recommended to be used in landscape mode<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

document.querySelector('#page_intro').insertAdjacentHTML('afterbegin', html);
},
setFillHeight: function () {
const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
},
handleFillHeight: function () {
if (this.os === 'android') {


const self = this;
self.setFillHeight();
window.addEventListener('resize', function () {
self.setFillHeight();
});
}
if ((this.os === 'iOS' || this.os === 'iPadOS') && this.browser === 'safari') {


document.documentElement.style.setProperty('--vh', '1dvh');
}

},
init: function () {
this.os = this.checkOS();
this.browser = this.checkBrowser();
if (this.os === 'iOS') {
this.version = this.checkOSVersion();
}

const isSP = this.os === 'iOS' || this.os === 'iPadOS' || this.os === 'android';
if (isSP) {
this.createAlertPortrait();
}

this.handleFillHeight();
}
}
if (window.parent.hasOwnProperty('lms_quiz') && window.parent.lms_quiz.hasOwnProperty('preview')) {
preview = window.parent.lms_quiz.preview;
}

$(function () {

$('[data-toggle="tooltip"]').tooltip();
init_quiz();
});


let initializedConfig;








async function init_quiz(options) {


options = $.extend(
false,
{
isFromResultPage: false,
targetMode: null,
},
options != null ? options : {}
);
cstate('intro');

load_config();

if (!options.isFromResultPage) {


if (!_cfg.settings.movable) {
$('th.button,td.button').hide();
}
save_templates();

quizUuid = uuidv4();
plan = await getUserPlan();

loadFontAwesomeResources();
init_scorm();


$('#question_statement').on('scroll', function(){
if (cq) {
if (pagination && pagination.hasSection) {
sectionScroll[cq.section] = {
left: $('#question_statement').scrollLeft(),
top: $('#question_statement').scrollTop()
}
} else {
questionScroll[position] = {
left: $('#question_statement').scrollLeft(),
top: $('#question_statement').scrollTop()
}
}
}
});

addEventListenerForModal();
} else {



_cfg.settings.scorm = APIVersion;
try {
load_suspend_data();
} catch (e) {
console_log(e);
console_log('Failed to load suspend data');
}
}

if (_cfg.settings.suspendable) {
setSuspendButtonVisibility(_cfg.settings.show_suspendable_button);
} else {
setSuspendButtonVisibility(false);
}

if (!_cfg.settings.remove_powered_by) {
$('#intro_wrapper').before(
'<div class="col-12" style="margin-top:-20px;"><kbd style="font-size:11px;" class="float-right">Powered by <a href="https://quizgenerator.net" target="_blank" style="color:white;">QuizGenerator' +
_cfg.settings.version +
'</a></kbd></div>'
);
}

for (let elem in _cfg.settings.messages) {
if (_cfg.settings.messages.hasOwnProperty(elem)) {
if (_cfg.settings.messages[elem]) {
$('#' + elem).html(convert_tags(_cfg.settings.messages[elem], { imgFlag: 'not_sa-box' }));
}
}
}
if (!_cfg.settings.show_instant_result) {
$('#result_table1 .result').hide();
}


if (_cfg.settings.layout === 'exam-vertical') {
$('#js-movable-btn-container').addClass('flex-row-reverse');

const angleRight = 'fa-angle-right';
const angleLeft = 'fa-angle-left';

const $prevBtn = $('#display_prev_quiz, #display_prev_explanation_page');
$prevBtn.addClass('right-radius').removeClass('left-radius');
$prevBtn.find('i').addClass(angleRight).removeClass(angleLeft);

$('#display_next_quiz, #display_next_explanation_page, #check_answer_next_button, #not_disp_answer_next_button').addClass('left-radius').removeClass('right-radius');
$('#display_next_quiz, #display_next_explanation_page').find('i').addClass(angleLeft).removeClass(angleRight);
}

if (!_cfg.settings.restartable) {
$('#restart_button').hide();
}
document.title = _cfg.settings.title;

if (_cfg.settings.mode === 'master') {
origProgress = get_completion_rate();
}

updateStartButtonAndGraphUI('#page_intro');
prepare_questions();
updateLinkTarget();


$('#flag-for-parent-frame').remove();

if (_cfg.settings.layout.indexOf('exam') > -1) {
window.layout.init();
window.document.body.classList.add('layout-exam');
window.document.body.classList.add(_cfg.settings.layout);
}

initializedConfig = $.extend(true, {}, _cfg);


const isExistSuspendData = Boolean(suspend_data_array && suspend_data_array.questions);
const isSuspendSetting = _cfg.settings.suspendable === true || _cfg.settings.suspendable === 'true_resume';

const isExistPrevQuestions = Boolean(suspend_data_array && suspend_data_array.prev_questions);
const isStartableAtResults = !options.isFromResultPage && isExistPrevQuestions && _cfg.settings.display_results_at_start;

$('.page_result--start_button_list').hide();
$('.page_result--restart_button_list').show();
if (_cfg.settings.skip_intro_page || options.isFromResultPage) {
autoStartRunner = setInterval(
function () {
waitAndAutostart(isExistSuspendData, isSuspendSetting, isStartableAtResults, options.targetMode);
},
5
);
} else {
if (isExistSuspendData && isSuspendSetting) {

show('#page_intro');
} else if (isStartableAtResults) {

$('.page_result--start_button_list').show();
$('.page_result--restart_button_list').hide();
show_result({
isResultsAtStart: true,
overridesQuestions: suspend_data_array.prev_questions,
origProgress: suspend_data_array.hasOwnProperty('origProgress') ? suspend_data_array.origProgress : null
});
} else {
show('#page_intro');
}
applyMathJax();
}
}




function updateStartButtonAndGraphUI(wrapper) {
wrapper = wrapper != null ? wrapper : '';

const $getTargetElement = function (selector) {
return wrapper === '' ?  $(selector) :  $(wrapper).find(selector);
}

$getTargetElement('#start_quiz_button_not_answerd').parent().hide();
$getTargetElement('#start_quiz_button_review').parent().hide();
$getTargetElement('#start_quiz_button_weak').parent().hide();
$getTargetElement('#go_to_result_button').hide();
$getTargetElement('#start_quiz_button').hide();
$getTargetElement('#completion_rate_wrapper').hide();
switch (_cfg.settings.mode) {
case 'master':
$getTargetElement('#completion_rate').html(get_completion_rate());

if (
count_correctly_answered_questions() >
_cfg.settings.master_count * _cfg.questions.length
) {
$getTargetElement('#completion_rate_label_wrapper').addClass('text-success');
}

if (
count_correctly_answered_questions() >=
_cfg.settings.master_count * _cfg.questions.length
) {
$getTargetElement('#start_quiz_button_not_answerd,#restart_quiz_button_not_answerd')
.prop('disabled', true)
.css('pointer-events', 'none');
$getTargetElement('#start_quiz_button_not_answerd,#restart_quiz_button_not_answerd')
.parent('div')
.css('cursor', 'not-allowed');
$getTargetElement('#stamp').show();
} else {
$getTargetElement('#start_quiz_button_not_answerd,#restart_quiz_button_not_answerd')
.prop('disabled', false)
.css('pointer-events', 'auto');
$getTargetElement('#start_quiz_button_not_answerd,#restart_quiz_button_not_answerd')
.parent('div')
.css('cursor', 'pointer');
$getTargetElement('#start_quiz_button_not_answerd,#restart_quiz_button_not_answerd')
.parent('div')
.tooltip('disable');
$getTargetElement('#stamp').hide();
}
if (
count_correctly_answered_questions() <
_cfg.settings.master_count * _cfg.questions.length
) {
$getTargetElement('#start_quiz_button_review')
.prop('disabled', true)
.css('pointer-events', 'none');
$getTargetElement('#start_quiz_button_review')
.parent('div')
.css('cursor', 'not-allowed');
} else {

$getTargetElement('#start_quiz_button_review')
.prop('disabled', false)
.css('pointer-events', 'auto');
$getTargetElement('#start_quiz_button_review')
.parent('div')
.css('cursor', 'pointer');
$getTargetElement('#start_quiz_button_review')
.parent('div')
.tooltip('disable');


if (_cfg.settings.show_a_look_back && suspend_data_array && suspend_data_array.prev_questions) {
$getTargetElement('#go_to_result_button').show();
}
}

$getTargetElement('#start_quiz_button_not_answerd').parent().show();
$getTargetElement('#start_quiz_button_review').parent().show();
$getTargetElement('#start_quiz_button_weak').parent().show();
$getTargetElement('#completion_rate_wrapper').show();

const graphData = [0, 0, 0, 0, 0];
for (let i = 0; i < _cfg.questions.length; i++) {
if (_cfg.questions[i].correct_count >= _cfg.settings.master_count) {
graphData[0]++;
} else if (_cfg.questions[i].unknown_flag) {
graphData[2]++;
} else if (_cfg.questions[i].correct_count > 0) {
graphData[1]++;
} else if (_cfg.questions[i].incorrect_count > 0) {
graphData[3]++;
} else {
graphData[4]++;
}
}
if (graphData[0] + graphData[1] + graphData[2] + graphData[3] == 0) {
$getTargetElement('#start_quiz_button_weak')
.prop('disabled', true)
.css('pointer-events', 'none');
$getTargetElement('#start_quiz_button_weak')
.parent('div')
.css('cursor', 'not-allowed');
} else {
$getTargetElement('#start_quiz_button_weak')
.prop('disabled', false)
.css('pointer-events', 'auto');
$getTargetElement('#start_quiz_button_weak')
.parent('div')
.css('cursor', 'pointer');
$getTargetElement('#start_quiz_button_weak')
.parent('div')
.tooltip('disable');
}
drawGraph(graphData);
break;
default:
$getTargetElement('#start_quiz_button').show();
}
}

function drawGraph(graphData) {
var ctxD = document.getElementById('doughnutChart').getContext('2d');
var myLineChart = new Chart(ctxD, {
type: 'doughnut',
data: {
labels: [
'Perfect!',
'In progress',
'Unknown',
'Incorrect',
'Not attempted'
],
datasets: [
{
data: graphData,
backgroundColor: [
'#00C851',
'#4285F4',
'#FF8800',
'#F7464A',
'#949FB1'
],
hoverBackgroundColor: [
'#00e25b',
'#5a95f5',
'#FFC870',
'#FF5A5E',
'#A8B3C5'
]
}
]
},
options: {
responsive: true,
legend: {
display: false
}
}
});
}

function waitAndAutostart(isExistSuspendData, isSuspendSetting, isStartableAtResults, targetMode) {
if (typeof MathJax !== 'undefined') {
clearInterval(autoStartRunner);
if (_cfg.settings.mode == 'master') {
if (targetMode != null) {
start_quiz(targetMode);
} else if (isStartableAtResults) {
show_result({
isResultsAtStart: true,
overridesQuestions: suspend_data_array.prev_questions,
origProgress: suspend_data_array.hasOwnProperty('origProgress') ? suspend_data_array.origProgress : null
});
} else {
start_quiz('review');
}
} else {
if (targetMode != null) {
start_quiz(targetMode);
} else if (isExistSuspendData && isSuspendSetting) {

start_quiz('resume');
} else if (isStartableAtResults) {

show_result({
isResultsAtStart: true,
overridesQuestions: suspend_data_array.prev_questions,
origProgress: suspend_data_array.hasOwnProperty('origProgress') ? suspend_data_array.origProgress : null
});
} else {
start_quiz();
}
}
}
}


function show_result_from_intro() {

const isExistPrevQuestions = Boolean(suspend_data_array && suspend_data_array.prev_questions);
if (!isExistPrevQuestions) return;
show_result({
overridesQuestions: suspend_data_array.prev_questions,
origProgress: suspend_data_array.hasOwnProperty('origProgress') ? suspend_data_array.origProgress : null
});
}

function getUserPlan() {

if (isInLbox()) {
return $.ajax({
type: 'POST',
url: '/sys/manage_sco.php?action=getUserPlan',
}).fail(function () {
return '';
});
}
return '';
}




function isInLbox() {
return getLboxVersion() !== null;
}




function getLboxVersion() {
try {
return window.top.lbox.version;
} catch {

return null;
}
}





function versionToNumber(version) {
if (version == null) {
return 0;
}
const match = version.match(/^(\d{1,2}).(\d{1,2}).(\d{1,2})$/);
if (!match) {
return 0;
}
return Number(match[1]) * 10000 + Number(match[2]) * 100 + Number(match[3]);
}

function save_templates() {

single_choice_template = $('#choice').html();
single_choice_box_template = $('#choice_box').html();
multi_choice_template = $('#multi_choice').html();
button_template = $('#button').html();
input_template = $('#input').html();
before_question_template = $('#before').html();
input_math_template = $('#input_math').html();
fill_in_multi_template = $('#fill_in_multi').html();
textarea_template = $('#textarea').html();
textarea_drawingboard_template = $('#textarea_drawingboard').html();
file_submission_template = $('#file_submission').html();
true_false_template = $('#true_false').html();
sort_template = $('#sort').html();
wordbank_template = $('#wordbank').html();
match_template = $('#match').html();
result_detail_template1 = $('#result_table1 .result_detail').prop('outerHTML');
result_detail_template2 = $('#result_table2 .result_detail').prop('outerHTML');
}

function load_config() {
var i;
if (typeof config !== 'undefined') {
delete default_config.questions;
_cfg = $.extend(true, {}, default_config, config);
} else {
_cfg = $.extend(true, {}, default_config);
}
for (i = 0; i < _cfg.questions.length; i++) {
_cfg.questions[i].iid = i;


_cfg.questions[i].media_count = 0;

_cfg.questions[i].media_history = [];

_cfg.questions[i].change_count = 0;

_cfg.questions[i].prev_latency = 0;
}
}




function addEventListenerForModal() {
$('.modal').on('show.bs.modal', function () {

preventKeydownEvent = true;
});

$('.modal').on('hide.bs.modal', function () {

preventKeydownEvent = false;

pauseAllMedias($(this).find('video'), $(this).find('audio'), false);
});
}

function prepare_questions() {

var i, q, j, shuffle_flg;
for (i = 0; i < _cfg.questions.length; i++) {
q = _cfg.questions[i];
if (
q.hasOwnProperty('type') &&
(q.type === 'fill-in' ||
q.type === 'textarea' ||
q.type === 'textarea-enquete' ||
q.type === 'textarea-report' ||
q.type === 'sort' ||
q.type === 'match' ||
q.type === 'wordbank' ||
q.type === 'fill-in-plus' ||
q.type === 'fill-in-multi' ||
q.type === 'pulldown' ||
q.type === 'page')
) {
q.type = String(q.type); //Nothing to do
} else if (
(q.hasOwnProperty('type') && q.type === 'ma') ||
(!q.hasOwnProperty('type') && typeof q.answer === 'object')
) {
q.type = 'ma';
} else if (
(q.hasOwnProperty('type') &&
(q.type === 'sa' || q.type === 'sa-box' || q.type === 'button' || q.type === 'true-false')) ||
(!q.hasOwnProperty('type') && typeof q.answer === 'string')
) {
if (!q.hasOwnProperty('type') && typeof q.answer === 'string' && q.type !== 'sa-box') {
q.type = 'sa';
}
if (q.type === 'true-false') {
q.choice = ['true', 'false'];
}
if (typeof q.answer === 'string') {
q.answer = [q.answer];
}
addFeedbackMap(q);
} else {
alert('the setting file is broken');
}
delete q.feedback;
if (_cfg.settings.shuffle_choices) {

if (q.type === 'sa' || q.type === 'sa-box' || q.type === 'ma' || q.type === 'button') {
q.choiceIndex = q.choice.shuffle();
}
}
if (q.type === 'pulldown') {
q.choiceIndex = [];
for (j = 0; j < q.choice.length; j++) {
q.choiceIndex[j] = q.choice[j].shuffle();
}
}
if (q.type === 'sort' || q.type === 'wordbank') {
if (q.choice.length > 1) {
shuffle_flg = false;
while (!shuffle_flg) {
q.choiceIndex = q.choice.shuffle();
shuffle_flg = is_shuffle(q.choice, q.answer);
}
}
}
if (q.type === 'match') {
if (q.choice.length > 1) {
shuffle_flg = false;
while (!shuffle_flg) {
q.choiceIndex = q.choice.shuffle();
shuffle_flg = is_shuffled_match(q.choice, q.answer, q.match_key);
}
}
}

addId(q);
}
}


function addFeedbackMap(q) {
if (!(q.type === 'sa' || q.type === 'sa-box' || q.type === 'button' || q.type === 'true-false')) return;
let feedback = false;
q.feedback_map = {};

q.is_feedback_one = q.hasOwnProperty('feedback') && (typeof q.feedback === 'string' | q.feedback.length === 1);
for (j = 0; j < q.choice.length; j++) {
if (q.hasOwnProperty('feedback')) {
if (typeof q.feedback === 'string') {
feedback = q.feedback;
} else if (j < q.feedback.length) {
feedback = q.feedback[j];
}
}
q.feedback_map[q.choice[j]] = feedback;
}
}


function addId(q) {

if (q.hasOwnProperty('quiz_id')) {
q.id = q.quiz_id;
} else {
q.id = String(i + 1);
while (q.id.length < _cfg.settings.id_digits) {
q.id = '0' + q.id;
}
q.id = _cfg.settings.id_prefix + q.id;
}
}


const masteredQuestionsQuizIdMap = {};
function load_suspend_data_body() {
for (i = 0; i < suspend_data_body.length; i += 4) {
if (_cfg.questions[i / 4]) {
_cfg.questions[i / 4].correct_count = parseInt(
suspend_data_body.substring(i, i + 2),
10
);
_cfg.questions[i / 4].incorrect_count = parseInt(
suspend_data_body.substring(i + 2, i + 4),
10
);
try {
_cfg.questions[i / 4].unknown_flag = parseInt(
suspend_data_body_unknown.substring(i / 4, i / 4 + 1),
10
); //unknown
} catch (e) {
_cfg.questions[i / 4].unknown_flag = 0;
}
}

if (_cfg.questions[i / 4].correct_count >= _cfg.settings.master_count) {
masteredQuestionsQuizIdMap[_cfg.questions[i / 4].quiz_id] = true;
}
}
}

var suspend_data_array;
function load_suspend_data() {

var i;
var suspend_data;
var recoveryData;
if (lbLocalStorage) {
recoveryData = lbLocalStorage.getItem("18337b0153d9b81df59034995afbf7c49b1ef4bc_recovery_data");
}
if (recoveryData == null) {
suspend_data = getValue('cmi.suspend_data');
} else {
suspend_data = recoveryData;
}
if (suspend_data && suspend_data.substring(0, 3) === '000') {

suspend_data_body = suspend_data.substring(4);
load_suspend_data_body();
} else if (suspend_data && suspend_data.substring(0, 1) === '{') {

suspend_data_array = JSON.parse(suspend_data);
suspend_data_body = suspend_data_array['counts'];
suspend_data_body_unknown = suspend_data_array['counts_unknown'];
load_suspend_data_body();
if (!check_suspend_data(suspend_data_array)) {

alert('Error occurred, the input data will be cleared (deleted) and it will go back to the beginning.');
clear_suspend_data_body();
} else if (suspend_data_array && suspend_data_array.hasOwnProperty('position')) {

$('#start_quiz_button').css('visibility', 'hidden');
$('#resume_quiz_button').show();

if (_cfg.settings.suspendable === true && _cfg.settings.mode === 'normal') {
$('#restart_quiz_button').show();
}
if (_cfg.settings.mode === 'master') {

if (_cfg.settings.suspendable === 'true_resume') {

$('#start_quiz_button_not_answerd').hide();
$('#start_quiz_button_weak').hide();
$('#start_quiz_button_review').hide();
} else {

$('#start_quiz_button_not_answerd').hide();
$('#restart_quiz_button_not_answerd').show();
}
}

if (suspend_data_array.hasOwnProperty('timeLeft') && suspend_data_array.timeLeft !== false) {
suspendDataInitialTimeLimit = suspend_data_array.timeLeft;
}
} else {
$('#resume_quiz_button').hide();
$('#restart_quiz_button').hide();
}
} else {
clear_suspend_data_body();
}
for (i = 0; i < _cfg.questions.length; i++) {
if (!_cfg.questions[i].hasOwnProperty('correct_count')) {
_cfg.questions[i].correct_count = 0;
_cfg.questions[i].incorrect_count = 0;
}
}

if (suspend_data_array) {
const v = Number(suspend_data_array.version ?? 0);
if (v < 20) {

if (
suspend_data_array.hasOwnProperty('questions')
) {

for (i = 0; i < suspend_data_array.questions.length; i++) {
if (
suspend_data_array.questions[i].hasOwnProperty('question_tag')
&& suspend_data_array.questions[i].question_tag.hasOwnProperty(suspend_data_array.questions[i].iid)
) {

suspend_data_array.questions[i].question_tag = suspend_data_array.questions[i].question_tag[suspend_data_array.questions[i].iid] || [];
}
}
}

if (
suspend_data_array.hasOwnProperty('prev_questions')
) {

for (i = 0; i < suspend_data_array.prev_questions.length; i++) {
if (
suspend_data_array.prev_questions[i].hasOwnProperty('question_tag')
&& suspend_data_array.prev_questions[i].question_tag.hasOwnProperty(suspend_data_array.prev_questions[i].iid)
) {

suspend_data_array.prev_questions[i].question_tag = suspend_data_array.prev_questions[i].question_tag[suspend_data_array.prev_questions[i].iid] || [];
}
}
}
}
}
}

function clear_suspend_data_body() {
suspend_data_body = '';
for (i = 0; i < _cfg.questions.length; i++) {
suspend_data_body += '0000';
}
}


function check_suspend_data(json_suspend_data) {

if (json_suspend_data == null) {
return false;
}

const suspend_data_checker = {
common : ['counts', 'counts_unknown', 'studyLog', 'version'],  // 共通の項目
normal : [],
};  // ノーマルモード・マスターモード専用の項目は現状無し


let checkResult = suspend_data_checker['common'].every(function(value) {
return value in json_suspend_data;
});
if (checkResult === false) {
return false;
}


if (_cfg.settings.mode == 'master') {
checkResult = !suspend_data_checker['normal'].some(function(value) {
return value in json_suspend_data;
});
}
return checkResult;
}

function save_suspend_data() {
setValue('cmi.suspend_data', generate_suspend_data(false));
}

function generate_suspend_data(localStorageMode) {
var i;
var counts = '';
var counts_unknown = '';
var suspend_data;
var cc = [];
var ic = [];
var uc = [];
for (i = 0; i < suspend_data_body.length; i += 4) {
cc[i / 4] = suspend_data_body.substring(i, i + 2);
ic[i / 4] = suspend_data_body.substring(i + 2, i + 4);
try {
uc[i / 4] = suspend_data_body_unknown.substring(i / 4, i / 4 + 1);
} catch (e) {
uc[i / 4] = 0;
}
}
for (i = 0; i < _cfg.questions.length; i++) {
cc[_cfg.questions[i].iid] = format99(_cfg.questions[i].correct_count);
ic[_cfg.questions[i].iid] = format99(_cfg.questions[i].incorrect_count);
uc[_cfg.questions[i].iid] = _cfg.questions[i].unknown_flag ? '1' : '0';
}
for (i = 0; i < cc.length; i++) {
counts += cc[i] + ic[i];
counts_unknown += uc[i];
}
suspend_data = {
version: suspend_data_version,
counts: counts,
counts_unknown: counts_unknown
};
if (
(_cfg.settings.suspendable === true || _cfg.settings.suspendable === 'true_resume') &&
(state === 'quiz' || state === 'list' || state === 'suspended')
) {
suspend_data.state = state;
suspend_data.suspend_count = currentSuspendCount;
suspend_data.questions = _cfg.questions;
suspend_data.position = position;
suspend_data.timeLeft = timeLeft;
suspend_data.originAudioLimitNumMap = originAudioLimitNumMap;
} else if (_cfg.settings.display_results_at_start || _cfg.settings.show_a_look_back) {

suspend_data.prev_questions = _cfg.questions;

if (_cfg.settings.mode === 'master') {
suspend_data.origProgress = origProgress;
}
}


suspend_data.studyLog = studyLogArray;

return str = JSON.stringify(suspend_data);
}

function format99(num) {

if (num < 10) {
return '0' + num;
}
if (num < 100) {
return String(num);
}
return '99';
}

function sortSectionArray(originalSortOrder, sortArray) {
return originalSortOrder.map(function (index) {
return sortArray[index]
});
}


function randomSection() {

let sectionArray = [];
let tempArray = [];
for (let i = 0; i < _cfg.questions.length; i++) {
if (_cfg.questions[i + 1]) {
if (_cfg.questions[i].section == _cfg.questions[i + 1].section) {

tempArray.push(_cfg.questions[i]);
} else {


tempArray.push(_cfg.questions[i]);
sectionArray.push(tempArray);
tempArray = [];
}
} else {


tempArray.push(_cfg.questions[i]);
sectionArray.push(tempArray);
}
}


for (let i = sectionArray.length - 1; i > 0; i--) {
let random = Math.floor(Math.random() * (i + 1));
let temp = sectionArray[i];
sectionArray[i] = sectionArray[random];
sectionArray[random] = temp;
}


let convertSectionArray = [];
convertSectionArray = Array.prototype.concat.apply([], sectionArray);


let originalOrderArray = [];

convertSectionArray.forEach(function (element) {
originalOrderArray.push(element.section);
});


originalOrderArray = originalOrderArray.filter(function (value, index, self) {
return self.indexOf(value) === index;
});


let section = 0;
for (let i = 0; i < convertSectionArray.length; i++) {
let currentSection = convertSectionArray[i].section
convertSectionArray[i].section = section;
if (convertSectionArray[i + 1] && currentSection != convertSectionArray[i + 1].section) {
section++;
}
}


_cfg.questions = convertSectionArray


_cfg.settings.section_name_array = sortSectionArray(originalOrderArray, _cfg.settings.section_name_array);
_cfg.settings.non_section_array = sortSectionArray(originalOrderArray, _cfg.settings.non_section_array);
_cfg.settings.section_tag_array = sortSectionArray(originalOrderArray, _cfg.settings.section_tag_array);
_cfg.settings.section_return_rule_array = sortSectionArray(originalOrderArray, _cfg.settings.section_return_rule_array);
_cfg.settings.section_no_array = sortSectionArray(originalOrderArray, _cfg.settings.section_no_array);
_cfg.settings.question_tag_array = sortSectionArray(originalOrderArray, _cfg.settings.question_tag_array);
_cfg.settings.question_count_array = sortSectionArray(originalOrderArray, _cfg.settings.question_count_array);
}







function formattedQuestion(qi, si) {
if (_cfg.settings.hasOwnProperty('section_name_array')) {
_cfg.questions[qi].section_name =
_cfg.settings.section_name_array[si];
}
if (_cfg.settings.hasOwnProperty('non_section_array')) {
_cfg.questions[qi].non_section = _cfg.settings.non_section_array[si];
}
if (_cfg.settings.hasOwnProperty('section_tag_array')) {

_cfg.questions[qi].section_tag = _cfg.settings.section_tag_array[si] || [];
}
if (_cfg.settings.hasOwnProperty('section_return_rule_array')) {
_cfg.questions[qi].section_return_rule = _cfg.settings.section_return_rule_array[si];
}
if (_cfg.settings.hasOwnProperty('section_no_array')) {
_cfg.questions[qi].section_no = _cfg.settings.section_no_array[si];
}
if (_cfg.settings.hasOwnProperty('question_tag_array')) {

_cfg.questions[qi].question_tag =
_cfg.settings.question_tag_array[si][_cfg.questions[qi].iid] || [];
}
}


function order_by_section() {
'user strict';


const minSectionLength = 2;
if (_cfg.settings.shuffle_sections && minSectionLength <= _cfg.settings.section_name_array.length) {
randomSection();
}


_cfg.questions.forEach(function (question) {
question.sort = 9999;
});

_cfg.settings.question_count_array.forEach(function (_count, si) {

const questionsNumber = _cfg.questions.filter(function(question) {
return question.section == si;
}).length;


const isRequiredRandom = questionsNumber > Number(_cfg.settings.question_count_array[si]);
const hasSection = _cfg.settings.non_section_array.indexOf(false) > -1;


_cfg.settings.question_count_array[si] = Math.min(
_cfg.settings.question_count_array[si],
questionsNumber
);

if (!hasSection && !_cfg.settings.shuffle_questions) {
_cfg.questions.forEach(function(question, i) {
if (question.section != si) return;
formattedQuestion(i, si);
})
return;
}

let qi = 0;
let processed_cnt = 0;
while (processed_cnt < _cfg.settings.question_count_array[si]) {
if (isRequiredRandom) {
qi = Math.floor(Math.random() * _cfg.questions.length);
}

if (_cfg.questions[qi].sort == 9999) {

if (_cfg.questions[qi].section == si) {
_cfg.questions[qi].sort = si;
if (_cfg.settings.shuffle_questions) {
_cfg.questions[qi].sort += Math.random();
}
formattedQuestion(qi, si);
processed_cnt++;
}
}
if (!isRequiredRandom) {
qi += 1;
}
}
});

_cfg.questions.sort(function (a, b) {
return a.sort - b.sort;
});
}


function order_by_correct_answer_minus_incorrect_answer() {

_cfg.questions.sort(function (a, b) {
return (
a.correct_count -
a.incorrect_count -
(b.correct_count - b.incorrect_count)
);
});
}

function order_by_question_id() {

_cfg.questions.sort(function (a, b) {
return a.iid - b.iid;
});
}


function filter_by_correct_answer_count(limit) {

var i;
if (i === undefined) {
i = 0;
}
for (i = 0; i < _cfg.questions.length; i++) {
if (_cfg.questions[i].correct_count > limit) {
_cfg.questions.splice(i, 1);
i--;
}
}
}

function filter_by_status(limit) {

var i, is_weak;
for (i = 0; i < _cfg.questions.length; i++) {
is_weak = true;
if (_cfg.questions[i].correct_count > limit) {
is_weak = false;
console.log('correct enough');
}
if (
_cfg.questions[i].incorrect_count + _cfg.questions[i].correct_count ==
0
) {
is_weak = false;
console.log('no attempt');
}
if (is_weak === false) {
_cfg.questions.splice(i, 1);
i--;
}
}
}

function count_correctly_answered_questions() {

var count = 0,
i;
for (i = 0; i < _cfg.questions.length; i++) {
count += _cfg.questions[i].correct_count;
}
return count;
}

function count_not_correctly_answered_questions_float1(limit) {

var count = 0,
i;
for (i = 0; i < _cfg.questions.length; i++) {
if (!_cfg.questions[i].hasOwnProperty('correct_count')) {
count += 1;
} else if (_cfg.questions[i].correct_count <= limit) {
count += 1 - _cfg.questions[i].correct_count / limit;
}
}
return count;
}

function count_not_correctly_answered_questions_float2() {

var count = 0,
i;
for (i = 0; i < _cfg.questions.length; i++) {
if (!_cfg.questions[i].hasOwnProperty('correct_count')) {
count += 1;
} else {
count += 1 - _cfg.questions[i].correct_count;
}
}
return count;
}

function get_completion_rate() {

if (
count_correctly_answered_questions() <=
_cfg.settings.master_count * _cfg.questions.length
) {
return String(
Math.round(
(1 -
count_not_correctly_answered_questions_float1(
_cfg.settings.master_count
) /
_cfg.questions.length) *
100
)
);
} else {
return String(
Math.round(
((1 -
count_not_correctly_answered_questions_float2() /
_cfg.questions.length) /
_cfg.settings.master_count) *
100
)
);
}
}

let pagination = null;
let drawingboard = null;
let fileSubmission = null;

function start_quiz(mode) {





if (_cfg.settings.mode == 'master') {
if(get_score() >= _cfg.settings.passing_score) {
setValue('cmi.core.lesson_status', 'passed');
}else{
setValue('cmi.core.lesson_status', 'incomplete');
}
setValue('cmi.core.score.raw', Math.floor(get_score()));
} else {
setValue('cmi.core.lesson_status', 'incomplete');
}
const coreChildren = getValue('cmi.core._children');
if (coreChildren && coreChildren.indexOf('event') != -1) {
setValue('cmi.core.event', 'started');
}
commit();

startTime = new Date().getTime();
$('#page_intro video,#page_intro audio,#page_intro iframe').remove();
if (mode !== undefined) {
if (mode === 'not_answerd') {
filter_by_correct_answer_count(_cfg.settings.master_count - 1);
} else if (mode === 'weak') {
if (
count_correctly_answered_questions() >=
_cfg.settings.master_count * _cfg.questions.length
) {
_cfg.settings.shuffle_questions = false;
order_by_correct_answer_minus_incorrect_answer();
_cfg.questions = _cfg.questions.slice(0, _cfg.settings.weak_count);
} else {
_cfg.settings.shuffle_questions = false;
order_by_correct_answer_minus_incorrect_answer();
filter_by_correct_answer_count(_cfg.settings.master_count - 1);
}
} else if (mode === 'review') {
_cfg.settings.shuffle_questions = true;
} else if (mode === 'resume') {
position = suspend_data_array.position;
setTimeout(function () {
var new_state = suspend_data_array.state;
if (new_state == 'suspended') {
new_state = 'quiz';
}
cstate(new_state);
}, 50);
_cfg.questions = suspend_data_array.questions;
if (suspend_data_array.hasOwnProperty('originAudioLimitNumMap')) {
originAudioLimitNumMap = suspend_data_array.originAudioLimitNumMap;
}
}
_cfg.actionmode = mode;
}

if (mode !== 'resume') {
order_by_section();    // タグ付け以降、order_by_sectionでランダム出題なども対応
}


settingSectionReturnRule();


settingDisplayPositions();


settingQuestionCount();
$('#question_count').html(_cfg.settings.question_not_page_count);


settingSuspendOption(mode);

cstate('quiz');
display_quiz();

if (mode !== 'resume') {
suspendDataInitialTimeLimit = null;
}
init_timer();
show('#page_quiz');


if (_cfg.settings.movable && !_cfg.settings.hide_pagination && !pagination) {
pagination = new Pagination('#pagination', _cfg.questions);

if (mode === 'resume') {
pagination.allQuestionToggleAnswerState();
}

$('#question_count_wrapper').hide();
} else {
$('#question_count_wrapper+.tooltip-common').remove();
}


if (drawingboard) {
drawingboard.resize();
}
}






function settingDisplayPositions() {
let num = 0;
for (let i = 0; i < _cfg.questions.length; i++) {
display_positions[i] = num;

if (_cfg.questions[i].type !== 'page') {
num++;
}
}
}






function settingQuestionCount() {
if (_cfg.settings.hasOwnProperty('question_count_array')) {

_cfg.settings.question_count = 0;


_cfg.settings.question_scoring_count = 0;

_cfg.settings.question_not_page_count = 0;

let sectionQuizMaxArray = getSectionQuizMaxArray(_cfg.questions);

for (let i = 0; i < _cfg.settings.question_count_array.length; i++) {

if (_cfg.settings.question_count_array[i] > sectionQuizMaxArray[i]) {
_cfg.settings.question_count_array[i] = sectionQuizMaxArray[i];
}
_cfg.settings.question_count += _cfg.settings.question_count_array[i];
_cfg.settings.question_scoring_count += _cfg.questions.filter(function (q) { return q.section === i; }).slice(0, _cfg.settings.question_count_array[i]).filter(function (q) { return !q.hasOwnProperty('ignoreFromScoring') && q.type !== 'page'; }).length;
_cfg.settings.question_not_page_count += _cfg.questions.filter(function (q) { return q.section === i; }).slice(0, _cfg.settings.question_count_array[i]).filter(function (q) { return q.type !== 'page'; }).length;
}
} else {
if (!_cfg.settings.hasOwnProperty('question_count')) {
_cfg.settings.question_count = _cfg.questions.length;
_cfg.settings.question_scoring_count = _cfg.questions.filter(function (q) { return !q.hasOwnProperty('ignoreFromScoring') && q.type !== 'page'; }).length;
_cfg.settings.question_not_page_count = _cfg.questions.filter(function (q) { return q.type !== 'page'; }).length;
} else {
_cfg.settings.question_count = Math.min(
_cfg.questions.length,
_cfg.settings.question_count
);
_cfg.settings.question_scoring_count = _cfg.questions.slice(0, _cfg.settings.question_count).filter(function (q) { return !q.hasOwnProperty('ignoreFromScoring') && q.type !== 'page'; }).length;
_cfg.settings.question_not_page_count = _cfg.questions.slice(0, _cfg.settings.question_count).filter(function (q) { return q.type !== 'page'; }).length;
}
}
}

function settingSuspendOption(mode){
if (_cfg.settings.suspendable) {

_cfg.settings.suspendable_count = Math.floor(_cfg.settings.suspendable_count);

if (1 <= _cfg.settings.suspendable_count && _cfg.settings.suspendable_count <= 99) {
if (suspend_data_array && suspend_data_array.hasOwnProperty('suspend_count') && mode == 'resume') {


currentSuspendCount = suspend_data_array['suspend_count'] + 1;
} else {

currentSuspendCount = 1;
}
if (_cfg.settings.suspendable_count <= (currentSuspendCount - 1)) {

$('#suspend_button').removeClass('btn-outline-warning');
$('#suspend_button').addClass('btn-blue-grey');
$('#suspend_button').html('<span>Pause:' + _cfg.settings.suspendable_count + '/' + _cfg.settings.suspendable_count + '</span>');
$('#suspend_button').prop('disabled', true);
$("#suspend_button").removeAttr("onclick");
$('.suspend_tooltip').text('You cannot pause the session anymore');

$('#suspend_button').css('pointer-events', 'none');
$('#suspend_button_wrapper').css('cursor', 'not-allowed');
$('#suspend_button_wrapper').attr('tabindex', '0');
} else {

$('#suspend_button').html('<span>Pause:' + (currentSuspendCount - 1) + '/' + _cfg.settings.suspendable_count + '</span>');
}
}
setSuspendButtonVisibility(_cfg.settings.show_suspendable_button);
} else {
setSuspendButtonVisibility(false);
}
}

function setSuspendButtonVisibility(isVisible) {
const $btn = $('#suspend_button')
const $tooltip = $btn.closest('.tooltip-wrapper');
if (isVisible) {
$tooltip.show();
} else {
$tooltip.hide();
$btn.removeAttr("onclick");
}
}

function init_timer() {

if (_cfg.settings.time_limit) {
$('.timer-frame').contents().find('.timer').countdown('destroy');
$('.timer-frame').contents().find('body').empty();
$('.timer-frame').contents().find('style').remove();


$timerFrame = $('.timer-frame').contents();
$timerFrame.find('head').append('<style>html,body{font-family:sans-serif;line-height:24px;margin:0;padding:0;color:#868e96;-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none;user-select:none;}</style>');
$timerFrame.find('body').append('<span class="timer">timer</span>');

$timerFrame.on('contextmenu', function () { return false; });
const $timer = $timerFrame.find('.timer');



const timeLimit = (suspendDataInitialTimeLimit === null ? _cfg.settings.time_limit : suspendDataInitialTimeLimit) * 1000;
suspendDataInitialTimeLimit = null;

$('.timer-frame:first').contents().find('.timer').countdown({
until: new Date(new Date().getTime() + timeLimit),
format: 'HMS',
onTick: checkTimeLimit,
tickInterval: 1,
compact: true
});
$('.timer-frame:not(:first)').contents().find('.timer').countdown({
until: new Date(new Date().getTime() + timeLimit + 100),
format: 'HMS',
tickInterval: 1,
compact: true
});

if (_cfg.settings.time_limit_mode === 'question' && cq.result) {
$timer.countdown('pause');
}
} else {

$('#timer_wrap_quiz').remove();
$('#timer_wrap_list').remove();
}
}
function checkTimeLimit(t) {

if (finished) {
return;
}
const baseTimeLeft = t[6] + t[5] * 60 + t[4] * 3600;
timeLeft = baseTimeLeft;
const width = (timeLeft / _cfg.settings.time_limit) * 100;
const quizId = cq.quiz_id;
$('.progress-bar.bg-success').css('width', width.toPrecision(4) + '%');
const div = 30;
for (let i = 1; i < div; i++) {
const tmpTimeLeft = baseTimeLeft - i / div;
const tmpWidth = (tmpTimeLeft / _cfg.settings.time_limit) * 100;
setTimeout(
function (l, w) {


if ((_cfg.settings.time_limit_mode === 'question' && cq.result) || quizId !== cq.quiz_id) {
return;
}
timeLeft = l;
$('.progress-bar.bg-success').css('width', w.toPrecision(4) + '%');
}.bind(null, tmpTimeLeft, tmpWidth),
(i / div) * 1000
);
}
for (let i = 0; i < 7; i++) {
if (t[i] !== 0) {
return;
}
}
if (_cfg.settings.time_limit_mode == 'total') {
$('.ui-draggable-dragging').remove(); // Timelimit for all questions
check_answer(false, true, true);
show_result();

helpToolTipHide();
} else if (_cfg.settings.time_limit_mode == 'question') {

if (state === 'list') {

hide_list();
}
if(_cfg.settings.show_instant_result) {
check_answer(false, true, true);
} else {
check_answer(false, true, false);
if (has_next_quiz()) {
display_next_quiz();
} else {
show_result();
}
}
helpToolTipHide();
}
}


function isNumber(answerArray, type) {

const regEXP = (type === 'fill-in-plus') ? /^[-+,\d]+$/ : /^[-+\d]+$/;
let isNumber = true;
for (var i = 0; i < answerArray.length; i++) {
if (type === 'fill-in-multi') {

if (!answerArray[i].split('::').every((v) => regEXP.test(v))) {
isNumber = false;
}
} else {
if (!regEXP.test(answerArray[i])) {
isNumber = false;
}
}
}
return isNumber;
}




const isActiveFillInMaxLength = () => {
if (!['fill-in', 'fill-in-plus', 'fill-in-multi'].includes(cq.type)) return false;

const isNumberInput = _cfg.settings.use_number_type_for_input;
if (!isNumberInput) return false;

const settingValue = _cfg.settings.fill_in_max_length;
return settingValue === 'auto' || (settingValue.match(/^([1-9]\d*)$/) && 0 < settingValue);
}


const CACHE_MAX_LENGTH_MAP = new Map();




const getFillInMaxLength = () => {
if (CACHE_MAX_LENGTH_MAP.has(cq.id)) return CACHE_MAX_LENGTH_MAP.get(cq.id);

if (!isActiveFillInMaxLength()) {
CACHE_MAX_LENGTH_MAP.set(cq.id, null);
return null;
}

let maxLength;
switch (cq.type) {
case 'fill-in': {
const settingValue = _cfg.settings.fill_in_max_length;
if (settingValue === 'auto') {

maxLength = cq.answer.reduce((max, a) => Math.max(max, a.length), 0);
break;
}
maxLength = Number(settingValue);
break;
}
case 'fill-in-plus': {
const settingValue = _cfg.settings.fill_in_max_length;
if (settingValue === 'auto') {
let strLength = 0;

for (let i = 0; i < cq.answer.length; i++) {

strLength += cq.answer[i].split(',').reduce((max, a2) => Math.max(max, a2.length), 0)
}

strLength += cq.answer.length - 1;
return strLength;
}
maxLength = Number(settingValue);
break;
}
case 'fill-in-multi': {
const settingValue = _cfg.settings.fill_in_max_length;
const tmp = [];
for (let i = 0; i < cq.answer.length; i++) {
let strLength;
if (settingValue !== 'auto') {
strLength = Number(settingValue);
} else {

strLength = cq.answer[i].split('::').reduce((max, a) => Math.max(max, a.length), 0);
}
tmp.push(strLength);
}
maxLength = tmp;
break;
}
default: {
maxLength = null;
}
}
CACHE_MAX_LENGTH_MAP.set(cq.id, maxLength);
return maxLength;
}




const validateFillInMaxLength = (value, index) => {
const maxLengthNumOrList = getFillInMaxLength();
const maxLength = index == null ? maxLengthNumOrList : maxLengthNumOrList?.[index];
const replacedValue = value.slice(0, maxLength ?? value.length);
const result = value === replacedValue;
return { result, replacedValue };
}




function addFillInLengthLimitEvent(target, index) {
$(document).on('keyup change blur', target, function (event) {

if (event.type == 'focusout') {
$('.input_limit_error_message').hide();
return;
}

const value = removeControlCharacter($(this).val());


if (cq.hasOwnProperty('previousLimitValue') && cq.previousLimitValue == value) {
return;
}
if (cq.hasOwnProperty('previousLimitValueArray') && cq.previousLimitValueArray[index] == value) {
return;
}

const { result, replacedValue } = validateFillInMaxLength(value, index);

if (result) {

$('.input_limit_error_message').hide();
} else {
$(this).val(replacedValue);

$('.input_limit_error_message').show();
}


if (cq.hasOwnProperty('previousLimitValueArray')) {
cq.previousLimitValueArray[index] = replacedValue;
} else {
cq.previousLimitValue = replacedValue;
}
});
}


function settingFillInLengthLimit() {
switch (cq.type) {
case 'fill-in':
case 'fill-in-plus': {
const maxLength = getFillInMaxLength();
if (maxLength == null) return;
addFillInLengthLimitEvent('#input_line');
return;
}
case 'fill-in-multi': {
cq.previousLimitValueArray = [];
getFillInMaxLength()?.forEach((_len, i) => {
classPos = '.pos' + i;

addFillInLengthLimitEvent(`.input.fill_in_multi.pos${i}`, i);
});
return;
}
default: {

}
}
}


function settingFilInPermitOnlyNumber() {
if (isActiveFillInNumberOnly()) {

cq.previousValue = '';
let descriptionEvent = addFillInNumberEvent(null, null);
cq.descriptionEventList.push(descriptionEvent);
}
}


function settingFillInMultiPermitOnlyNumber() {
if (isActiveFillInNumberOnly()) {

cq.previousValueArray = [];
for (let i = 0; i < cq.answer.length; i++) {
cq.previousValueArray[i] = '';
const targetPosClass = '.pos' + i;
const descriptionEvent = addFillInNumberEvent(targetPosClass, i);
cq.descriptionEventList.push(descriptionEvent);
}
}
}


function resetFillInEvent(answerNum)
{
$(document).off('keyup change blur', '#input_line');
for (let i = 0; i < answerNum; i++){
$(document).off('keyup change blur', '.input.fill_in_multi.pos' + i);
}
}



function loadFontAwesomeResources() {
$('body').append('<div style="position:absolute;top:-2000px;left:-2000px;z-index:-1"><i class="fas fa-question"></i><i class="far fa-question"></i><i class="fal fa-question"></i><i class="fab fa-chrome"></i></div>');
}

var answerMathField;

function display_quiz() {
var i,
cq_question,
input_html,
choice_value,
choice_html,
scale,
match_list_width,
drag_list;
setTimeout(function () {
window.scrollTo(0, 0);
if (isIOS() && API !== null && !API.hasOwnProperty('dummy')) {
parent.scrollTo(0, 0);
}
}, 50);


limitedAudioCount = -1;


if (pagination) {
pagination.toggleAnswerState(cq, previousPosition);
}


if (cq && cq.descriptionEventList) {
cq.descriptionEventList.forEach(function (event) {
event.off('keyup change');
});
}


cq = _cfg.questions[position];


cq.descriptionEventList = [];


$('#page_quiz').attr('data-quiz-id', cq.quiz_id);


if (_cfg.settings.hide_list_button) {
$('#hide_list_button').hide();
} else {
$('#hide_list_button').show();
}


if (_cfg.settings.tag_visible) {
$('.tag_visible').show();
} else {
$('.tag_visible').hide();
}

$('#position').html(display_positions[position] + 1);
$('#instant_feedback_msg').html('');
if (cq.hasOwnProperty('section_name')) {
if (cq.non_section == false) {
$('#section_name').html(h(htmlspecialchars_decode(cq.section_name, 'ENT_QUOTES')));
$('#section_name').removeClass();
$('#section_name').addClass('section_name_' + (cq.section % 6));
$('#section_name').addClass('card card-body');
} else {
$('#section_name')
.parent()
.empty();
}
if (cq.section_name == undefined || cq.section_name == '') {
$('#section_name').hide();
} else {
$('#section_name').show();
}
if ($('#section_tag').has('span')) {
$('#section_tag').empty();
}
for (var i = 0; i < cq.section_tag.length; i++) {
if (cq.section_tag[i] != '') {
$('#section_tag').append(
'<span class="section_tag_' +
(i + 1) +
'"' +
'style="font-size: 12px; color: white; background-color: #007E33; padding: 3px 4px; margin: 0 3px; border-radius: 3px">' +
h(cq.section_tag[i]) +
'</span>'
);
}
}
if ($('#question_tag').has('span')) {
$('#question_tag').empty();
}
for (var i = 0; i < cq.question_tag.length; i++) {
$('#question_tag').append(
'<span class="question_tag_' +
cq.iid +
'_' +
(i + 1) +
'"' +
'style="font-size: 12px; color: white; background-color: #00b549; padding: 3px 4px; margin: 0 3px; border-radius: 3px">' +
h(cq.question_tag[i]) +
'</span>'
);
}
setTimeout(update_seigo_counts, 10); // wait until section name width is updated
} else {
update_seigo_counts();
}
$('#choices').empty();
$('#instant_answer_msg').empty();
$('#instant_response_disp').hide();
$('#instant_response_disp_none').hide();
$('#instant_result_wrapper').hide();
$('#instant_answer_wrapper').hide();
$('#instant_feedback_wrapper').hide();
$('#instant_response_container').hide();
$('#instant_response_background').hide();
$('#answer_mark_correct').hide();
$('#answer_mark_incorrect').hide();
$('#show_result').hide();
if (has_next_quiz() && _cfg.settings.movable) {
if (_cfg.questions[position + 1].type !== 'page') {
$('#display_next_quiz').css('display', 'block');
$('#display_next_explanation_page').css('display', 'none');
} else {
$('#display_next_quiz').css('display', 'none');
$('#display_next_explanation_page').css('display', 'block');
}
} else {
$('#display_next_quiz').css('display', 'none');
$('#display_next_explanation_page').css('display', 'none');

$('#display_next_quiz').next('.tooltip-common').css('display', 'none');
}
if (has_prev_quiz() && _cfg.settings.movable && movableBySectionReturnRule(position, position - 1)) {
if (_cfg.questions[position - 1].type !== 'page') {
$('#display_prev_quiz').css('display', 'block');
$('#display_prev_explanation_page').css('display', 'none');
} else {
$('#display_prev_quiz').css('display', 'none');
$('#display_prev_explanation_page').css('display', 'block');
}
} else {
$('#display_prev_quiz').css('display', 'none');
$('#display_prev_explanation_page').css('display', 'none');

$('#display_prev_quiz').next('.tooltip-common').css('display', 'none');
}
$('#check_answer_next_button')
.hide()
.attr('disabled', true);
if (_cfg.settings.show_instant_result) {
$('#not_disp_answer_next_button').hide();
$('#not_disp_answer_mark_button').hide();
if (cq.type === 'page') {
$('#check_answer_button').hide();




let isNextQuiz = getCountAllAnswers() + (cq.result !== 'neutral') < _cfg.settings.question_count;
if (isNextQuiz) {
if (has_next_quiz() && !_cfg.settings.movable) {
$('#check_answer_next_button').show();
$('#check_answer_next_button').removeAttr('disabled');
setTimeout(function () {
$('#check_answer_next_button').focus();
}, 100);
}
} else {
if (isQuizUIVisible()) {
$('#show_result').show();
$('#abort_quiz').hide();
setTimeout(function () {
$('#show_result').focus();
}, 100);
}
}
} else if (cq.type !== 'button' && cq.type !== 'true-false' && state != 'quiz_review') {
$('#check_answer_button').show();
} else {
$('#check_answer_button').hide();
}
} else {
$('#check_answer_button').hide();
if (!_cfg.settings.movable) {
$('#display_next_quiz').css('display', 'none');
$('#display_prev_quiz').css('display', 'none');
$('#display_next_explanation_page').css('display', 'none');
$('#display_prev_explanation_page').css('display', 'none');
$('#not_disp_answer_mark_button').css('margin-left', '5px');
if (has_next_quiz()) {
if (cq.type == 'button' || cq.type == 'true-false') {
$('#not_disp_answer_next_button').hide();
} else {
$('#not_disp_answer_next_button').show();
}
} else {
$('#not_disp_answer_next_button').hide();
}
} else {
$('#not_disp_answer_next_button').hide();
}
if (_cfg.settings.hide_mark_button && has_next_quiz()) {
$('#not_disp_answer_mark_button').hide();
} else {
$('#not_disp_answer_mark_button').show();
}
}
if ($(':focus').attr('id') === 'check_answer_next_button') {
$('#check_answer_next_button').blur();
}
cq_question = cq.question;
if (cq.type === 'wordbank') {
cq_question = convert_drop_list(cq_question);
}
cq_question = convert_tags(
cq_question,
{
imgFlag: 'not_sa-box',
audioKeyPrefix: getKeyPrefixOfLimitedAudio(cq, 'question')
}
);

if (cq.type === 'pulldown') {
cq_question = convert_pulldown(cq_question);
}
$('#question').html(cq_question);

if (cq.before_question) {
$('body').removeClass('no-before-question');
let convertBeforeQuestion = convert_tags(cq.before_question, { audioKeyPrefix: getKeyPrefixOfLimitedAudio(cq, 'before_question') });
$('#choices').append(before_question_template);
$('#before_question').html(convertBeforeQuestion);
} else {
$('body').addClass('no-before-question');
}
if (cq.type === 'fill-in' || cq.type === 'fill-in-plus') {
input_html = '<div class="choice">' + input_template + '</div>';


resetFillInEvent(cq.answer.length);

settingFilInPermitOnlyNumber();

settingFillInLengthLimit();

$('#choices').append(input_html);

$('#choices .input').attr('value', cq.student_response);
setTimeout(function () {
if (
$('#choices input')
.get(0)
.getBoundingClientRect().bottom <
window.innerHeight - 20
) {
$('#choices input')[0].focus();
}
}, 100);
} else if (cq.type === 'fill-in-multi') {
input_html = '<div class="choice">' + fill_in_multi_template + '</div>';


resetFillInEvent(cq.answer.length);

settingFillInMultiPermitOnlyNumber();

settingFillInLengthLimit();

$('#choices').append(input_html);

$('#choices .input').hide();
for (var i = 0; i < cq.answer.length; i++) {
$('#choices .pos' + i).show();
if (cq.label && cq.label[i]) {

$('#choices div.pos' + i).html(htmlencode(cq.label[i]));
}
}
if (cq.student_response) {
for (var i = 0; i < cq.answer.length; i++) {
$('#choices input.input.pos' + i).val(cq.student_response[i]);
}
}
setTimeout(function () {
if (
$('#choices input')
.get(0)
.getBoundingClientRect().bottom <
window.innerHeight - 20
) {
$('#choices input')[0].focus();
}
}, 100);
} else if (
cq.type === 'textarea' ||
cq.type === 'textarea-enquete' ||
cq.type === 'textarea-report'
) {
drawingboard = null;
fileSubmission = null;
if (cq.drawingboard) {
input_html = '<div class="choice">' + textarea_drawingboard_template + '</div>';
$('#choices').append(input_html);
drawingboard = new DrawingBoard({ aspectRatio: cq.drawingboard });
if (cq.student_response) {

drawingboard.loadFromDataURL(cq.student_response);
}
} else if (cq.file_submission) {
input_html = '<div class="choice">' + textarea_template + file_submission_template + '</div>';
$('#choices').append(input_html);
fileSubmission = new FileSubmission(quizUuid, plan, cq.file_submission, preview, file_submission_messages);
if (cq.student_response) {
const fileSubmissionData = JSON.parse(cq.student_response);
$('#choices textarea').text(fileSubmissionData.content);
fileSubmission.load(fileSubmissionData.files);
}
setTimeout(function () {
$('#choices textarea')[0].focus();
}, 100);
} else {
input_html = '<div class="choice">' + textarea_template + '</div>';
$('#choices').append(input_html);
$('#choices textarea').text(cq.student_response);
setTimeout(function () {
$('#choices textarea')[0].focus();
}, 100);
}
} else if (cq.type === 'button') {
for (i = 0; i < cq.choice.length; i++) {
choice_value = convert_tags(
cq.choice[i],
{ audioKeyPrefix: getKeyPrefixOfLimitedAudio(cq, 'choice', i) }
);
choice_html = button_template;
choice_html = choice_html.replace(/\[\[choice\]\]/g, choice_value);
choice_html = choice_html.replace(
/\[\[choice_key\]\]/g,
htmlencode(cq.choice[i])
);
choice_html = choice_html.replace(
/\[\[choice_key_js_escaped\]\]/g,
htmlencode(jsencode(cq.choice[i]))
);
choice_html = choice_html.replace(
/\[\[choice_id\]\]/g,
'choice_' + position + '_' + i
);
let className = 'choice';

if (cq.student_response && cq.student_response === cq.choice[i]) {
className += ' selected';
}
choice_html = '<div class="' + className + '">' + choice_html + '</div>';
$('#choices').append(choice_html);
}
if (_cfg.settings.pass) {
choice_value = 'Pass';
choice_html = button_template;
choice_html = choice_html.replace(/\[\[choice\]\]/g, choice_value);
choice_html = choice_html.replace(/\[\[choice_key\]\]/g, 'Not sure');
choice_html = choice_html.replace(
/\[\[choice_key_js_escaped\]\]/g,
htmlencode(jsencode('Not sure'))
);
choice_html = choice_html.replace(
/\[\[choice_id\]\]/g,
'choice_' + position + '_' + i
);
choice_html = '<div class="choice">' + choice_html + '</div>';
$('#choices').append(choice_html);
}
} else if (cq.type === 'true-false') {
$('#choices').append(true_false_template);

if (cq.student_response) {
$('#choice_' + cq.student_response).addClass('selected');
}
} else if (cq.type === 'sort') {
setDragDropList();
setDragDropEvent();
setTimeout(function () {
setDivHeight();
}, 10);
} else if (cq.type === 'match') {
setDragDropList();
setDragDropEvent();
setTimeout(function () {
setDivHeight();
}, 10);
if (pc_flg) {
scale = _cfg.settings.scale;
match_list_width =
$('.drag-choice')
.css('width')
.replace('px', '') * scale;
$('.drag-choice,.drop-choice-key').css('width', match_list_width);
}
} else if (cq.type === 'pulldown') {
if (cq.student_response) {
for (i = 0; i < cq.student_response.length; i++) {

if (cq.hasOwnProperty('is_selected') && !cq.is_selected[i]) {
$('select[data-number=' + i + ']').val('');
} else {
$('select[data-number=' + i + ']').val(cq.student_response[i]);
}
}
}
} else if (cq.type === 'page') {

} else if (cq.type === 'wordbank') {
for (i = 0; i < cq.choice.length; i++) {
choice_value = cq.choice[i];
choice_html = wordbank_template;
choice_html = choice_html.replace(
/\[\[choice\]\]/g,
convert_tags(
choice_value,
{ audioKeyPrefix: getKeyPrefixOfLimitedAudio(cq, 'choice', i) }
)
);
choice_html = choice_html.replace(
/\[\[choice_key\]\]/g,
htmlencode(cq.choice[i])
);
choice_html = choice_html.replace(/\[\[choice_idx\]\]/g, i);
$('#choices').append(choice_html);
}
setDragDropEvent();
if (cq.student_response) {
const drop_choice_list = $('.drop-choice-list');
for (let i = 0; i < cq.student_response.length; i++) {
if (cq.hasOwnProperty('is_selected') && !cq.is_selected[i]){
continue;
}
for (let j = 0; j < drop_choice_list.length; j++) {
if (
!drop_choice_list[j] ||
$(drop_choice_list[j]).find('.drag-value').attr('value') !== cq.student_response[i]
) {
continue;
}
drag_list = $(drop_choice_list[j]).children('.drag-choice-wordbank');
drag_list.parent('#choices .drop-choice-list').css('display', 'none');
$('#question .drop-choice-wordbank')
.eq(i)
.append(drag_list);
drag_list.prevAll('.wordbank-key').css('display', 'none');

drop_choice_list[j] = null;
break;
}
}
}
} else {

if (cq.type === 'sa-box') {
flex_sa_wrapper = '<div class="row flex-sa-wrapper"></div>';
$('#choices').append(flex_sa_wrapper);
}
for (i = 0; i < cq.choice.length; i++) {
choice_value = convert_tags(
cq.choice[i],
{ audioKeyPrefix: getKeyPrefixOfLimitedAudio(cq, 'choice', i) }
);
choice_html = '';
if (cq.type === 'ma') {
choice_html = multi_choice_template;
} else if (cq.type === 'sa') {
choice_html = single_choice_template;
} else if (cq.type === 'sa-box') {
choice_html = single_choice_box_template;
}
choice_html = choice_html.replace(/\[\[choice\]\]/g, choice_value);
choice_html = choice_html.replace(
/\[\[choice_key\]\]/g,
htmlencode(cq.choice[i])
);
choice_html = choice_html.replace(
/\[\[choice_id\]\]/g,
'choice_' + position + '_' + i
);

if (cq.type === 'sa-box') {
choice_html = '<div class="choice col-12 col-md-6 sa-box-choice">' + choice_html + '</div>';
$('.flex-sa-wrapper').append(choice_html);
} else {
choice_html = '<div class="choice">' + choice_html + '</div>';
$('#choices').append(choice_html);
}
}
if (_cfg.settings.pass) {
if (cq.type === 'sa-box') {
flex_sa_wrapper = '<div class="row flex-sa-wrapper"></div>';
$('#choices').append(flex_sa_wrapper);
}
choice_value = 'Pass';
choice_html = '';
if (cq.type === 'ma') {
choice_html = multi_choice_template;
} else if (cq.type === 'sa') {
choice_html = single_choice_template;
} else if (cq.type === 'sa-box') {
choice_html = single_choice_box_template;
}
choice_html = choice_html.replace(/\[\[choice\]\]/g, choice_value);
choice_html = choice_html.replace(/\[\[choice_key\]\]/g, 'Not sure');
choice_html = choice_html.replace(
/\[\[choice_id\]\]/g,
'choice_' + position + '_' + i
);
if (cq.type === 'sa-box') {
choice_html = '<div class="choice col-12 col-md-6 sa-box-choice">' + choice_html + '</div>';
$('.flex_sa_wrapper').append(choice_html);
} else {
choice_html = '<div class="choice">' + choice_html + '</div>';
$('#choices').append(choice_html);
}
}
$('.choice_checkbox').each(function () {
if (
cq.student_response &&
array_contain([$(this).attr('value')], cq.student_response)
) {
$(this).attr('checked', 'checked');
}
if (cq.limit) {
$(this).on('click', checkSelectionLimit);
}
});

window.checkedValue = undefined;
$('.choice_radio').each(function () {
if (
cq.student_response &&
array_contain([$(this).attr('value')], cq.student_response)
) {
$(this).attr('checked', 'checked');


window.checkedValue = $('.choice_radio:checked').val();
}
$(this).on('click', removeChecked);
});
setTimeout(function () {
if (
!(cq.type === 'true-false' || cq.type === 'button') &&
$('#choices input').get(0).getBoundingClientRect().bottom < window.innerHeight - 20
) {
$('#choices input')[0].focus();
}
}, 100);
}

if (cq.result) {
check_answer(false, false, true);
}
applyMathJax();


addMediaEvent(true);

if (_cfg.settings.autoplay) {

if ($('#contents_wrapper audio.autoplay:first').length > 0) {
$('#contents_wrapper audio.autoplay:first')[0].play();
}
}

cq.time = getCurrentTimeForSCORM12();
if (state === 'quiz_review' && _cfg.settings.show_instant_result === false) {
$('#show_result').show();
$('#not_disp_answer_next_button').hide();
$('#not_disp_answer_mark_button').hide();
}


if (pagination) {
pagination.updateActivePosition(position);
}


if (cq.type === 'page') {

$('#choices').hide();

if (_cfg.settings.layout === 'exam' || _cfg.settings.layout === 'exam-vertical') {
$('#question_statement').width('100%');
}

$('#question_count_default').hide();
$('#question_count_page_icon').show();

$('#question_statement + hr').hide();

$('#seigo_count').hide();
} else {

$('#choices').show();

if (_cfg.settings.layout === 'exam' || _cfg.settings.layout === 'exam-vertical') {
$('#question_statement').width('');
}

$('#question_count_default').show();
$('#question_count_page_icon').hide();

$('#question_statement + hr').show();

if (_cfg.settings.show_seigo_count) {
if (isQuizUIVisible()) {
$('#seigo_count').show();
}
}

if (drawingboard) {
drawingboard.resize();
}
}


helpToolTipHide();

if (_cfg.settings.layout === 'exam') {
window.layout.examFunc();
}

if (_cfg.settings.layout === 'exam-vertical') {
window.layout.examVerticalFunc();
}


if(sectionScroll && sectionScroll[cq.section]){
$('#question_statement').scrollTop(sectionScroll[cq.section].top);
$('#question_statement').scrollLeft(sectionScroll[cq.section].left);
} else if (questionScroll && questionScroll[position]){
$('#question_statement').scrollTop(questionScroll[position].top);
$('#question_statement').scrollLeft(questionScroll[position].left);
} else {
$('#question_statement').scrollTop(0);
if(isIE()){

$('#choices').scrollLeft(100000);
}else{
$('#question_statement').scrollLeft(0);
}
}


if(isIE()){

$('#choices').scrollLeft(4000);
}else{
$('#choices').scrollLeft(0);
}
$('#choices').scrollTop(0);



if (_cfg.settings.layout === 'exam-vertical' && (isIPadOS() || isIOS())) {
$('#contents_wrapper').css('visibility', 'hidden');
setTimeout(function() {
$('#contents_wrapper').css('visibility', 'visible');
}, 0);
}

fixVerticalChromeRenderingBug();
}





function renderForce(el, ms = 50) {
el.classList.add('forceRender');
setTimeout(() => {
el.classList.remove('forceRender');
}, ms);
};





function fixVerticalChromeRenderingBug() {
if (!(_cfg.settings.layout === 'exam-vertical' && isChrome())) return;


const verticalAreas = document.querySelectorAll('#question_statement, #choices');

let timeoutId;
verticalAreas.forEach((verticalArea) => {
verticalArea.addEventListener('scroll', () => {
clearTimeout(timeoutId);
timeoutId = setTimeout(() => { renderForce(verticalArea); }, 50);
});
})
}


function pushMediaLog(event) {
if (event.target.controls) {

_cfg.questions[position].media_count++;

_cfg.questions[position].media_history.push(event.target.src.split('/').pop());
}
}


function pauseMediaExcludeSelf(own, videos, audios, pauseGlobalAudio) {
if (pauseGlobalAudio == null) {
pauseGlobalAudio = true;
}
for (let i = 0; i < videos.length; i++) {
if (videos[i] != own) {
videos[i].pause();
}
}
for (let i = 0; i < audios.length; i++) {
if (audios[i] != own) {
audios[i].pause();
}
}

if (pauseGlobalAudio && globalAudioElement && own !== 'globalAudioElement') {
globalAudioElement.pause();
}
}


function pauseAllMedias(videos, audios, pauseGlobalAudio) {
if (pauseGlobalAudio == null) {
pauseGlobalAudio = true;
}
if (videos == null) {
videos = document.querySelectorAll('video');
}
if (audios == null) {
audios = document.querySelectorAll('audio');
}

for (let i = 0; i < videos.length; i++) {
videos[i].pause();
}
for (let i = 0; i < audios.length; i++) {
audios[i].pause();
}


if (pauseGlobalAudio && globalAudioElement) {
globalAudioElement.pause();
}
}


let preventMediaOnPlayEvent = false;
function addMediaEvent(isPauseMedia) {
const videos = document.querySelectorAll('video');
const audios = document.querySelectorAll('audio');

if (isPauseMedia) {

pauseAllMedias(videos, audios, false);
}

const callback = function (event) {
if (preventMediaOnPlayEvent) {
preventMediaOnPlayEvent = false;
return;
}

this.pause();
showPlayMediaConfirmationModal(
function () {
pauseMediaExcludeSelf(this, videos, audios);

preventMediaOnPlayEvent = true;
this.play();
pushMediaLog(event);
}.bind(this)
);
};


for (i = 0; i < videos.length; i++) {
const $video = $(videos[i]);

$video.off('play');
$video.on('play', callback);
}


for (i = 0; i < audios.length; i++) {
const $audio = $(audios[i]);

$audio.off('play');
const isResultSound = $.inArray($audio.attr('id'), ['correct_sound', 'incorrect_sound', 'dragged_sound']) !== -1;
if (isResultSound) {

$audio.on('play', function (event) {

pauseMediaExcludeSelf(this, videos, audios, false);
pushMediaLog(event);
});
} else {
$audio.on('play', callback);
}
}
}

function updateLinkTarget() {
$('a:not([data-my-result-history="1"]):not([data-type="exlink"]):not([data-type="related-contents"])').prop('target', '_blank');
}

function update_seigo_counts() {
if (_cfg.settings.show_seigo_count) {
if (isQuizUIVisible()) {
$('#correct-count >.num').html(cq.correct_count);
$('#incorrect-count >.num').html(cq.incorrect_count);
}
} else {
$('#seigo_count').hide();
}
}

var imgSize = {};
function applyMathJax() {

updateLinkTarget();
addOnClickEventToExlink();
$('img').on('load', function () {
var img = new Image();
img.src = $(this).attr('src');
img.originalSrc = $(this).attr('data-original-src');

img.onload = function () {
var width = img.width;
var height = img.height;
imgSize[img.originalSrc] = width + "x" + height;
initPhotoSwipeFromDOM('.my-gallery');
}
});

if (typeof MathJax !== 'undefined' && _cfg.settings.math && typeof MathJax.typeset === 'function') {
MathJax.typeset();
}


$('a[data-my-result-history="1"]').off();
$('a[data-my-result-history="1"]').on('click', function () {
new MyResult($(this).attr('data-sco-code'), $(this).attr('data-question-no'));
});
}

function addOnClickEventToExlink() {
$('a[data-type="exlink"]').off('click');
$('a[data-type="exlink"]').on('click', function (e) {
e.preventDefault();
showExlinkConfirmationModal(function () {
if (window !== window.top) {

window.top.$(window.top).off('beforeunload');
}

sendResult();

$(window).off(isIOS() || isIPadOS() || isAndroid() || isFirefox() ? 'pagehide' : 'beforeunload');

setTimeout(function () {

window.top.location.href = e.currentTarget.href;
}, 500);
});
});
}






function showExlinkConfirmationModal(callback) {
$('#exlink-confirmation-modal .modal-body > p').html(
isSuspendable() ? 'Suspend learning. Are you sure to leave?' : 'Finish learning. Are you sure to leave?'
);

$('#exlink-confirmation-button').off('click');
$('#exlink-confirmation-button').on('click', function (e) {
$('#exlink-confirmation-modal').modal('hide');
callback();
});
$('#exlink-confirmation-modal').modal();
}


function isSuspendable() {

if (!_cfg.settings.suspendable) return false;

if (1 <= _cfg.settings.suspendable_count && _cfg.settings.suspendable_count <= 99) {
return currentSuspendCount <= _cfg.settings.suspendable_count;
}
return true;
}




const isActiveFillInNumberOnly = () => {

return _cfg.settings.use_number_type_for_input && isNumber(cq.answer, cq.type)
}




const validateFillInNumberOnly = (value) => {

if (!isActiveFillInNumberOnly()) return { result: true, replacedValue: value };
let regExp;
switch (cq.type) {
case 'fill-in': {
regExp = /[^-+\d]+/g;
}
case 'fill-in-plus': {

regExp = /[^-+, 　\d]+/g;
break;
}
case 'fill-in-multi': {
regExp = /[^-+\d]+/g;
break;
}
default: {

return { result: true, replacedValue: value };
}
}
const replacedValue = value.replace(regExp, '');
const result = value === replacedValue;
return {
result,
replacedValue,
}
}


function addFillInNumberEvent(targetPosClass, index) {
let selector = '';
if (targetPosClass == null) {
selector = '#input_line';
} else {
selector = ".fill_in_multi" + targetPosClass;
}

return $(document).on('keyup change', selector, function () {

const value = removeControlCharacter($(this).val());

if (cq.hasOwnProperty('previousValue') && value == cq.previousValue) {
return;
}
if (cq.hasOwnProperty('previousValueArray') && value == cq.previousValueArray[index]) {
return;
}

const { result, replacedValue } = validateFillInNumberOnly(value);

if (result) {
$('.numeric_error_message').hide();
} else {
$(this).val(replacedValue);
$('.numeric_error_message').show();
}


if (cq.hasOwnProperty('previousValue')) {
cq.previousValue = replacedValue;
} else {
cq.previousValueArray[index] = replacedValue;
}
});
}


function zeroPadding(num, len) {
return (Array(len).join('0') + num).slice(-len);
}


function getDate() {
let dt = new Date();
let date = dt.getFullYear() + '/' + zeroPadding((dt.getMonth() + 1), 2) + '/' + zeroPadding(dt.getDate(), 2);
return date;
}


function getTime() {
let dt = new Date();
let time = zeroPadding(dt.getHours(), 2) + ':' + zeroPadding(dt.getMinutes(), 2) + ':' + zeroPadding(dt.getSeconds(), 2);
return time;
}


function getAnswer() {

let answer = 'unanswered';
if (cq.student_response.length !== 0) {
if (Array.isArray(cq.student_response)) {

answer = cq.student_response.concat();

for (i = 0; i < answer.length; i++) {
if (cq.type == 'fill-in-multi') {

if (answer[i] === '') {
answer[i] = 'unanswered';
}
} else {

if (answer[i] === 'Not selected') {
answer[i] = 'unselected';
}
}
}
} else {

answer = cq.type !== 'page' ? cq.student_response : '';
}
}
return answer;
}


function getResultMessage() {
let resultMessage = 'incorrect';

if (cq.hasOwnProperty('result') && cq.result) {
resultMessage = cq.result
} else if (cq.hasOwnProperty('tempResult') && cq.tempResult) {
resultMessage = cq.tempResult;
}


if (cq.type == 'textarea-report') {
resultMessage = 'scoring_pending';
}

return resultMessage;
}


function getCorrectness() {
if (_cfg.questions[position].hasOwnProperty('correctness')) {
return _cfg.questions[position].correctness;
} else {
return [_cfg.questions[position].answer.length, 0];
}
}


function getScoreRate(correctness) {
if (cq.type == 'textarea-report') {
return 'scoring_pending'
} else {

return round2ndDecimal((correctness[1] / correctness[0]) * 100);
}
}


function getScore(weight, correctness) {
if (cq.type == 'textarea-report') {
return 'scoring_pending'
} else {

return round2ndDecimal(fraction.toDouble(fraction.mul([1, weight], correctness)));
}
}


function getChoiceNo() {
if (!_cfg.questions[position].hasOwnProperty('choice_no')) {
return '';
}
if (typeof _cfg.questions[position].choice_no === 'object') {
return _cfg.questions[position].choice_no.join(', ');
}
return _cfg.questions[position].choice_no;
}


function getSectionNo() {
if (!_cfg.questions[position].hasOwnProperty('section_no')) {
return '';
}
return _cfg.questions[position].section_no;
}


function updateStudyLogInfo() {
for (i = studyLogArray.length - 1; 0 <= i; i--) {
if (cq.id == studyLogArray[i]['quiz_id']) {
studyLogArray[i]['last_answer_flag'] = '';

if (cq.type == 'textarea-report' || cq.type == 'page') {
studyLogArray[i]['result'] = '';
studyLogArray[i]['score_rate'] = '';
studyLogArray[i]['score'] = '';
studyLogArray[i]['scoring_pending_flag'] = false;
}
break;
}
}
}


function saveOperationLog() {

if (state != 'quiz' && state != 'list') { return; }


if (JSON.stringify(_cfg.questions[position].prev_student_response) !== JSON.stringify(cq.student_response)) {
if (cq.student_response.length > 0) {

_cfg.questions[position].change_count++;
}

updateStudyLogInfo();

let weight = _cfg.settings.score_weighting ? cq.weight : 100 / _cfg.settings.question_scoring_count | 0;
if (cq.type === 'page') weight = 0;

let correctness = getCorrectness();

let isScoringPending = false;
if (cq.type == 'textarea-report') {
isScoringPending = true;
}

let logData = {
quiz_id: cq.id,
answer_count: _cfg.questions[position].change_count,
last_answer_flag: 'TRUE',
scoring_pending_flag: isScoringPending,
problem_statement: cq.question,
answer: getAnswer(),
media_operation_count: _cfg.questions[position].media_count,
media_operation_history: _cfg.questions[position].media_history,
result: getResultMessage(),
point_allocation: round2ndDecimal(weight),
score_rate: getScoreRate(correctness),
score: getScore(weight, correctness),
duration: formatTimeIntervalForSCORM12((cq.latency - _cfg.questions[position].prev_latency) * 100),
answer_time: getDate() + ' ' + getTime(),
choice_no: getChoiceNo(),
section_no: getSectionNo(),
}
studyLogArray.push(logData);


_cfg.questions[position].prev_student_response = cq.student_response;

_cfg.questions[position].prev_latency = cq.latency;

_cfg.questions[position].media_count = 0;

_cfg.questions[position].media_history = [];
}
}

var blockDuplicatedMove = false;
function display_prev_quiz() {

if (!has_prev_quiz()) {
return;
}
if (blockDuplicatedMove) {
return;
}
blockDuplicatedMove = true;
setTimeout(function () {
blockDuplicatedMove = false;
}, 100);
moveQuiz(position, position - 1, function () {

check_answer(false, true, false);

previousPosition = position;
position--;
display_quiz();
});
}

function display_next_quiz() {

if (!has_next_quiz()) {
return;
}
if (blockDuplicatedMove) {
return;
}
blockDuplicatedMove = true;
setTimeout(function () {
blockDuplicatedMove = false;
}, 100);

moveQuiz(position, position + 1, function () {

check_answer(false, true, false);

previousPosition = position;
position++;
display_quiz();
if (_cfg.settings.time_limit_mode == 'question') {
init_timer();
}
});
}

function has_prev_quiz() {

return position > 0;
}

function has_next_quiz() {

return position < _cfg.settings.question_count - 1;
}

function getMediaData(a, b, isWidth) {

if (isWidth == null) { isWidth = true; }

let bArray = b.split(/ +/);
let style = '';
let alt = '';

for (let i = 1; i < bArray.length; i++) {
let vals = bArray[i].split('=');
let key = vals[0];
let value = vals[1];
if (key == 'width' && isWidth) style += 'width:' + value + 'px;';
if (key == 'height') style += 'height:' + value + 'px;';
if (key == 'alt') alt += value;
}

if (new RegExp('\\.svg$', 'i').test(bArray[0]) && style === '') {

style = 'width:100%;';
}


let array = {
'style': style,
'url': bArray[0],
'alt': alt,
};

return array;
}

let globalAudioElement;
let globalAudioLimit;

function playSpecifiedTimesAudio(count, originKey) {
if (_cfg.questions[position]['one_time_audio_' + count] == false) {
let $audio = $("#one_time_audio_" + count).get(0);


if (_cfg.settings.background_audio_playback) {
showPlayMediaConfirmationModal(
function () {
if (globalAudioElement) {
globalAudioElement.pause();
}

globalAudioElement = new Audio($audio.src);


const videos = document.querySelectorAll('video');
const audios = document.querySelectorAll('audio');
pauseMediaExcludeSelf('globalAudioElement', videos, audios);


globalAudioElement.play();
decrementOneTimeAudioLimit(count, originKey);
globalAudioLimit = _cfg.questions[position]['one_time_audio_limit_' + count];
}
);
return;
}


$audio.pause();
$audio.currentTime = 0;
$audio.play();
decrementOneTimeAudioLimit(count, originKey);
}
}


function decrementOneTimeAudioLimit(count, originKey) {

_cfg.questions[position]['one_time_audio_limit_' + count]--;
if (originKey) {
originAudioLimitNumMap[originKey]--;
}


if (_cfg.questions[position]['one_time_audio_limit_' + count] <= 0 || (originKey && originAudioLimitNumMap[originKey] <= 0)) {
$("#one_time_audio_button_" + count).prop("disabled", true);
_cfg.questions[position]['one_time_audio_' + count] = true;

if (originKey) {
$("audio[data-origin-key='" + originKey + "'] + input[id^=one_time_audio_button_]").prop("disabled", true);
}
}
}


function loadAudio(count, limitNum, originKey) {
if (originKey) {

if (!originAudioLimitNumMap.hasOwnProperty(originKey)) {
originAudioLimitNumMap[originKey] = limitNum;
}
_cfg.questions[position]['one_time_audio_limit_' + count] = originAudioLimitNumMap[originKey];
_cfg.questions[position]['one_time_audio_' + count] = originAudioLimitNumMap[originKey] <= 0;
} else {

if (_cfg.questions[position]['one_time_audio_' + count] == null) {
_cfg.questions[position]['one_time_audio_' + count] = false;
_cfg.questions[position]['one_time_audio_limit_' + count] = limitNum;
}
}

if (_cfg.questions[position]['one_time_audio_' + count]) {
$('#one_time_audio_button_' + count).prop("disabled", true);
}
}

function getPlayAudioLimitNum(group) {

let limitNum = 1;


if (group.match(/.+.mp3::{(\d+)}/i)) {

limitNum = group.match(/.+.mp3::{(\d+)}/i)[1];
}

return limitNum;
}

function getPlayAudioOriginKey(group) {

if (group.match(/::(origin_.+)$/)) {

return group.match(/::(origin_.+)$/)[1];
}

return '';
}






function showPlayMediaConfirmationModal(callback) {
const shouldShowModal = _cfg.settings.background_audio_playback && globalAudioElement && !globalAudioElement.paused && globalAudioLimit <= 0;

if (!shouldShowModal) {
callback();
return;
}


$('#play-media-confirmation-button').off('click');
$('#play-media-confirmation-button').on('click', function (e) {
$('#play-media-confirmation-modal').modal('hide');
callback();
});
$('#play-media-confirmation-modal').modal();
}


function convert_tags(str, options) {
if (options == null) {
options = {};
}
str = convert_reference_tags(str, 0, options.audioKeyPrefix);
str = convert_image_tags(str, options.imgFlag);
return str;
}


function convert_reference_tags(str, depth, audioKeyPrefix) {
if (depth == null) {
depth = 0;
}

if (depth >= 10) {
return str;
}
if (audioKeyPrefix != null) {
str = addKeyToLimitedAudio(str, audioKeyPrefix);
}
str = str.replace(/%%%([^:]*?):([^:]*?)(:([^:]*?))?%%%/g, function (all, id, type, _, index) {
const question = get_question_by_id(id);
if (typeof index === 'undefined') {
switch (type) {
case 'choice_value':

if (!canUseShortcodeInChoice(question.type)) {
return formatter(question, 'student_response', false);
}

let nextAudioKeyPrefix;
if (Array.isArray(question.student_response)) {

nextAudioKeyPrefix = null
} else {
nextAudioKeyPrefix = getKeyPrefixOfLimitedAudio(question, 'student_response')
}
return convert_reference_tags(formatter(question, 'student_response', false), depth + 1, nextAudioKeyPrefix);
case 'choice_number':
const shuffledIndex = question.choice.findIndex(function(elem){return elem == question.student_response;});
const originalIndex = question.hasOwnProperty('choiceIndex') ? question.choiceIndex[shuffledIndex] : (shuffledIndex + 1);
return originalIndex;
case 'quiz_text':
return  convert_reference_tags(question.question, depth + 1, getKeyPrefixOfLimitedAudio(question, 'question'));
default:
alert('error: invalid reference type: ' + type);
}
} else {
if (typeof question.student_response === 'undefined' || typeof question.student_response[index - 1] === 'undefined') {
if (type == 'choice_value') {
return 'Not selected';
} else {
return '0';
}
} else {
if (type == 'choice_value') {
return convert_reference_tags(question.student_response[index - 1], depth + 1, getKeyPrefixOfLimitedAudio(question, 'student_response', index - 1));
} else if (type == 'choice_number') {
if (question.type === 'pulldown') {
const shuffledIndex = question.choice[index - 1].findIndex(function(elem){return elem == question.student_response[index - 1];});
let originalIndex = question.hasOwnProperty('choiceIndex') ? question.choiceIndex[index - 1][shuffledIndex] : (shuffledIndex + 1);
if (typeof originalIndex === 'undefined') {
originalIndex = 0;
}
return originalIndex;
} else { // match, order, wordbank の場合
const shuffledIndex = question.choice.findIndex(function(elem){return elem == question.student_response[index - 1];});
let originalIndex = question.hasOwnProperty('choiceIndex') ? question.choiceIndex[shuffledIndex] : (shuffledIndex + 1);
if (typeof originalIndex === 'undefined') {
originalIndex = 0;
}
return originalIndex;
}
} else {
alert('error: invalid reference type: ' + type)
}
}
}
});
return str;
}


function get_question_by_id(id) {
for (let i = 0; i < _cfg.questions.length; i++) {
if (_cfg.questions[i].id == id) {
return _cfg.questions[i];
}
}
alert('error: question id does not exist: ' + id);
}











function addKeyToLimitedAudio(str, keyPrefix) {
let cnt = -1;

return str.replace(/\[\[\[(.+?\.mp3.*?)\]\]\]/gi, function (match, p1) {
cnt++;
return '[[[' + p1 + '::origin_' + keyPrefix + '_' + cnt + ']]]';
});
}









function getKeyPrefixOfLimitedAudio(question, propertyName, i) {
let keyPrefix = '';
if (question != null) {
keyPrefix += question.id;
}

switch (propertyName) {
case 'choice': {
keyPrefix += '_' + propertyName;
const hasChoiceNo =
i != null &&
question.hasOwnProperty('choiceNoList') &&
question.hasOwnProperty('choiceIndex') &&
(question.choiceIndex[i] - 1) in question.choiceNoList;
if (hasChoiceNo) {
keyPrefix += '_' + question.choiceNoList[question.choiceIndex[i] - 1];
} else if (i != null) {
keyPrefix += '_' + String(i);
} else {
return '';
}
break;
} case 'student_response': {
if (question.hasOwnProperty('choice_no')) {

keyPrefix += '_choice';
if (!Array.isArray(question.choice_no)) {
keyPrefix += '_' + question.choice_no;
} else if (i != null) {
keyPrefix += '_' + (i in question.choice_no ? question.choice_no[i] : String(i));
} else {
return '';
}
} else {
keyPrefix += '_' + propertyName;
if (i != null) {
keyPrefix += '_' + String(i);
}
}
break;
} default: {
keyPrefix += '_' + propertyName;
if (i != null) {
keyPrefix += '_' + String(i);
}
}
}
return keyPrefix;
}

function convert_image_tags(str, cq_question_img_flag) {


if (_cfg.settings.autoplay) {
str = str.replace(
/\[\[\[((.+?.mp3).*?)\]\]\]/gi, function (all, group1, group2) {

limitedAudioCount++;

const limitNum = getPlayAudioLimitNum(group1);
const originKey = getPlayAudioOriginKey(group1);

return '<span>' +
'<audio id="one_time_audio_' + limitedAudioCount + '" class="audio audio_with_controls" src="' + group2 + '" preload="none" onloadstart="loadAudio(' + limitedAudioCount + ',' + limitNum + ',\'' + originKey + '\')" onloadeddata="playSpecifiedTimesAudio(' + limitedAudioCount + ',\'' + originKey + '\')" data-origin-key="' + originKey + '"  />' +
'</span>'
}
);
} else {
str = str.replace(
/\[\[\[((.+?.mp3).*?)\]\]\]/gi, function (all, group1, group2) {

limitedAudioCount++;

const limitNum = getPlayAudioLimitNum(group1);
const originKey = getPlayAudioOriginKey(group1);

return '<span>' +
'<audio id="one_time_audio_' + limitedAudioCount + '" class="audio audio_with_controls" src="' + group2 + '" preload="none" onloadstart="loadAudio(' + limitedAudioCount + ',' + limitNum + ',\'' + originKey + '\')" data-origin-key="' + originKey + '" />' +
'<input id="one_time_audio_button_' + limitedAudioCount + '" type="button" value="Play" onClick="playSpecifiedTimesAudio(' + limitedAudioCount + ',\'' + originKey + '\')">' +
'</span>'
});
}

if (isEdge() || isIE()) {
str = str.replace(
/\[\[([^[]*?[.]mp3)\]\]/gi,
'<audio class="audio audio_with_controls autoplay" src="$1" preload="none" controls controlslist="nodownload" onclick="this.play()"/>'
);
} else {
str = str.replace(
/\[\[([^[]*?[.]mp3)\]\]/gi,
'<audio class="audio audio_with_controls autoplay" src="$1" preload="none" controls controlslist="nodownload"/>'
);
}


str = str.replace(/\[\[([^\]]*?\.mp4[^\]]*?)\]\]/gi, function (match, p1) {
let mediaData = getMediaData(match, p1, false);
return '<video src="' + mediaData['url'] + '" style="' + mediaData['style'] + ' max-width:100%"></video>';
});


str = str.replace(/<video.*?<\/video>/g, function(match) {
return match.slice(0, 7) + ' preload="none" controls ' + match.slice(7);
});


str = str.replace(/\[\[LINK\s+(.+?)\]\]/g, function (all, attrStr) {
const attrs = { title: '', href: '', icon: '', };
attrStr.replace(/(title|href|icon)=(?:'([^']+?)'|"([^"]+?)")/g, function (all, key, value1, value2) {
attrs[key] = value1 ? value1 : value2;
});
const contentsURL = unescapeHtml(attrs.href);
return '\
<a class="btn btn-primary btn-rounded btn-sm waves-effect waves-light related-contents-btn" target="_top" href="' + contentsURL + '" data-type="related-contents">\
<i class="' + attrs.icon + ' related-contents-icon"></i>\
<span class="related-contents-title">' + attrs.title + '</span>\
</a>\
';
});


str = str.replace(/\[\[EXLINK\s+(.+?)\]\](.+?)\[\[\/EXLINK\]\]/g, function (all, attrStr, children) {
const attrs = { title: '', href: '', icon: '', };

attrStr.replace(/(title|href|icon)=(?:'([^']+?)'|"([^"]+?)")/g, function (all, key, value1, value2) {
attrs[key] = value1 ? value1 : value2;
});
const contentsURL = unescapeHtml(attrs.href);
let html = '<a href="' + contentsURL + '" title="' + attrs.title + '" data-type="exlink">';
if (attrs.icon) {
html += '<i class="' + attrs.icon + '"></i> ';
}
html += children + '</a>';
return html;
});


str = str.replace(/\[\[a href:(.+?)\]\](.+?)\[\[\/a\]\]/g, function (match, href, children) {
const mediaData = getMediaData(match, href);
let imgTag = "";
if (mediaData['alt']){
imgTag = '<img src="' + mediaData['url'] + '" data-original-src="' + mediaData['url'] + '" alt="' + mediaData['alt'] + '" data-qgsrc="' + mediaData['url'] + '" style="' + mediaData['style'] + ';display:none;">';
} else {
imgTag = '<img src="' + mediaData['url'] + '" data-original-src="' + mediaData['url'] + '" alt="' + mediaData['url'] + '" data-qgsrc="' + mediaData['url'] + '" style="' + mediaData['style'] + ';display:none;">';
}
const linkTag = '<a href="' + mediaData['url'] + '" data-size="600x400">' + imgTag + children + '</a>';
const myGalleryTag = '<div class="my-gallery">' + '<figure>' + linkTag + '</figure>' + '</div>';

return (myGalleryTag);
});


str = str.replace(/\[\[RESULT sco_code=(?:"|')?(.+?)(?:"|')? question_no=(?:"|')?(.+?)(?:"|')?\]\](.+?)\[\[\/RESULT\]\]/g, function (match, _scoCode, _questionNo, _children) {
return '<a href="javascript:void(0);" data-my-result-history="1" data-sco-code="' + _scoCode + '" data-question-no="' + _questionNo + '">' + _children + '</a>';
});

str = str.replace(
/\{\{([^\}]*?)\}\}/g,
'<img src="$1" class="thumnaildefault" style="margin: 0px;"/>'
);
str = str.replace(/\[\[([^\]]*?)\]\]/g, function (match, p1) {
let mediaData = getMediaData(match, p1);
let imgTag = "";
if (mediaData['alt']){
imgTag = '<img src="' + mediaData['url'] + '" data-original-src="' + mediaData['url'] + '" alt="' + mediaData['alt'] + '" data-qgsrc="' + mediaData['url'] + '" style="' + mediaData['style'] + '">';
} else {
imgTag = '<img src="' + mediaData['url'] + '" data-original-src="' + mediaData['url'] + '" alt="' + mediaData['url'] + '" data-qgsrc="' + mediaData['url'] + '" style="' + mediaData['style'] + '">';
}
let saBoxTag = '<div class="sa-box-img waves-effect waves-light">' + imgTag + '</div>';
let myGalleryTag = '<div class="my-gallery">' + '<figure>' + '<a href="' + mediaData['url'] + '" data-size="600x400" class="imglink">' + imgTag + '</a>' + '</figure>' + '</div>';

if (cq_question_img_flag !== 'not_sa-box' && cq.type === 'sa-box') {
return (saBoxTag);
} else {
return (myGalleryTag);
}
});

return str;
}

function convert_drop_list(str) {

return str.replace(
/\{(\d+?)\}/g,
'<span class = "drop-choice-wordbank"><span class="wordbank-key">（$1）</span></span>'
);
}

function convert_pulldown(str) {

return str.replace(/\{(\d+?)\}/g, function (i, j) {
var list = cq['choice'][j - 1],
ret = '',
k;
ret += "<select class='mdb-select' data-number='" + (j - 1) + "'>";
ret += "<option value=''>   </option>";
for (k = 0; k < list.length; k++) {
ret +=
'<option value="' +
htmlencode(list[k]) +
'">' +
htmlencode(list[k]) +
'</option>';
}
ret += '</select>';
return ret;
});
}

function button_click(value) {


if (state == 'quiz') {
last_button_value = value;
if (!cq.hasOwnProperty('result')) {
for (i = 0; i < cq.choice.length; i++) {
const $choice = cq.type === 'button' ? $('#choice_' + position + '_' + i).closest('.choice') : $('#choice_' + cq.choice[i]);
$choice.removeClass('selected');
if (cq.choice[i] === value) {
$choice.addClass('selected');
}
}
}
if (_cfg.settings.show_instant_result) {
check_answer(true, true, true);
} else {
check_answer(false, true, false);

if (!_cfg.settings.movable) {
if (has_next_quiz()) {
display_next_quiz();
} else {
mark_quiz();
}
}
}
}
}

function store_answer(isAlert) {

let student_response, is_selected;
if (state !== 'quiz' && state !== 'unload_check_answer') {
return;
}
if (cq.hasOwnProperty('result')) {
return;
}
switch (cq.type) {
case 'sa':
case 'sa-box':
case 'ma': {
let checked_answer = $('.choice_radio:checked');
student_response = [];
if (checked_answer.length === 0) {
checked_answer = $('.choice_checkbox:checked');
}
checked_answer.each(function () {
student_response.push($(this).attr('value'));
});
break;
}
case 'fill-in':
case 'fill-in-plus': {

const value = removeControlCharacter($('#input_line').val());

const { replacedValue: value1 } = validateFillInNumberOnly(value);

const { replacedValue: value2 } = validateFillInMaxLength(value1);
student_response = value2;
break;
}
case 'fill-in-multi': {
student_response = [];
$('#choices').find('input.js-fill-in-multi-input').each(function (index) {
if (student_response.length < cq.answer.length) {

const value = removeControlCharacter($(this).val());

const { replacedValue: value1 } = validateFillInNumberOnly(value);

const { replacedValue: value2 } = validateFillInMaxLength(value1, index);
student_response.push(value2);
}
});
break;
}
case 'textarea':
case 'textarea-enquete':
case 'textarea-report': {
if (cq.drawingboard) {

student_response = drawingboard.getDataURL();
} else if (cq.file_submission) {
if ($('#form-textarea').val() !== '' || !fileSubmission.isEmpty()) {

student_response = JSON.stringify({
content: $('#form-textarea').val(),
files: cq.files,
});
} else {
student_response = '';
}
} else {
student_response = $('#form-textarea').val();
}
break;
}
case 'button':
case 'true-false': {

if (last_button_value.length == 0 && (cq.hasOwnProperty('student_response') && cq.student_response.length > 0)) {
student_response = cq.student_response;
} else {
student_response = last_button_value;
}
last_button_value = '';
break;
}
case 'sort':
case 'match': {
student_response = [];
$('.drag-choice').each(function () {
student_response.push(
$(this)
.find('.drag-value')
.attr('value')
);
});
if (!change_sort_flg && !is_shuffle(cq.choice, student_response)) {
student_response = [];
}
break;
}
case 'wordbank': {
student_response = [];
is_selected = [];
$('.drop-choice-wordbank').each(function () {
if ($(this).children('.drag-choice-wordbank').length === 0) {
student_response.push('Not selected');
is_selected.push(false);
return true;
}
student_response.push(
$(this)
.find('.drag-value')
.attr('value')
);
is_selected.push(true);
});
break;
}
case 'pulldown': {
student_response = [];
is_selected = [];
$('select').each(function (i, j) {
if (!$(j).val()) {
student_response[$(j).data('number')] = 'Not selected';
is_selected[$(j).data('number')] = false;
return true;
}
student_response[$(j).data('number')] = $(j).val();
is_selected[$(j).data('number')] = true;
});
break;
}
case 'page': {

student_response = 'dummy_response';
break;
}
}
if (isAlert && !_cfg.settings.allow_submission_without_answer && !hasAnswered(cq.type, student_response, is_selected)) {
return;
}
cq.student_response = student_response;
if (is_selected) {
cq.is_selected = is_selected;
}
if (cq.hasOwnProperty('choiceNoList')) {
cq.choice_no = getChoiceNoFromStudentResponse(cq);
}
storeRecoveryData();
}








function removeControlCharacter(str) {
if (typeof str !== 'string' && !(str instanceof String)) {
return str;
}

if (isIE()) {




const controlCharacters =

'\0-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F' +

'\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B\u200C\u200E\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB' +

'\u0378\u0379\u0380-\u0383\u038B\u038D\u03A2\u0530\u0557\u0558\u058B\u058C\u0590\u05C8-\u05CF\u05EB-\u05EE\u05F5-\u05FF\u070E\u074B\u074C\u07B2-\u07BF\u07FB\u07FC\u082E\u082F\u083F\u085C\u085D\u085F\u086B-\u086F\u088F\u0892-\u0897\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FF\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A77-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0AF8\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B54\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0BFF\u0C0D\u0C11\u0C29\u0C3A\u0C3B\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5B\u0C5C\u0C5E\u0C5F\u0C64\u0C65\u0C70-\u0C76\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDC\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0CFF\u0D0D\u0D11\u0D45\u0D49\u0D50-\u0D53\u0D64\u0D65\u0D80\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DE5\u0DF0\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E8B\u0EA4\u0EA6\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F6\u13F7\u13FE\u13FF\u169D-\u169F\u16F9-\u16FF\u1716-\u171E\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u181A-\u181F\u1879-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE\u1AAF\u1ACF-\u1AFF\u1B4D-\u1B4F\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C89-\u1C8F\u1CBB\u1CBC\u1CC8-\u1CCF\u1CFB-\u1CFF\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u2065\u2072\u2073\u208F\u209D-\u209F\u20C1-\u20CF\u20F1-\u20FF\u218C-\u218F\u2427-\u243F\u244B-\u245F\u2B74\u2B75\u2B96\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E5E-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u3130\u318F\u31E4-\u31EF\u321F\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA6F8-\uA6FF\uA7CB-\uA7CF\uA7D2\uA7D4\uA7DA-\uA7F1\uA82D-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C6-\uA8CD\uA8DA-\uA8DF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F\uAB6C-\uAB6F\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uD7FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC3-\uFBD2\uFD90\uFD91\uFDC8-\uFDCE\uFDD0-\uFDEF\uFE1A-\uFE1F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD\uFEFE\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFF8\uFFFE\uFFFF' +

'\uE000-\uF8FF' +

'\uD800-\uDFFF';

const regex = RegExp('[' + controlCharacters + ']', 'g');
return str.replace(regex, '');
}


const excepts = '\\u{000a}\\u{000d}\\u{200d}';
const regex = RegExp('[^\\P{C}' + excepts + ']', 'gu');
return str.replace(regex, '');
}







function getChoiceNoFromStudentResponse(question) {
student_response = question.student_response;
if (student_response == null) {
return null;
}

if (question.type === 'true-false') {
if (student_response === 'true') {
return question.choiceNoList[0];
}
if (student_response === 'false') {
return question.choiceNoList[1];
}
return '';
}

if(!Array.isArray(student_response)) {
const shuffledIndex = question.choice.findIndex(function(elem){return elem == student_response;});
if (shuffledIndex < 0) {
return '';
}
const originalIndex = question.hasOwnProperty('choiceIndex') ? question.choiceIndex[shuffledIndex] : (shuffledIndex + 1);
return question.choiceNoList[originalIndex - 1];
}

usedIndex = {};
if (question.type === 'pulldown') {
return student_response.map(function (res, i) {
usedIndex[i] = {};
const shuffledIndex = question.choice[i].findIndex(function(elem, j){return elem == res && !usedIndex[i].hasOwnProperty(j);});
if (shuffledIndex < 0 || (question.hasOwnProperty('is_selected') && !question.is_selected[i])) {
return '';
}
usedIndex[i][shuffledIndex] = true;
const originalIndex = question.hasOwnProperty('choiceIndex') ? question.choiceIndex[i][shuffledIndex] : (shuffledIndex + 1);
return question.choiceNoList[i][originalIndex - 1];
});
}
return student_response.map(function (res, i) {
const shuffledIndex = question.choice.findIndex(function(elem, j){return elem == res && !usedIndex.hasOwnProperty(j);});
if (shuffledIndex < 0 || (question.hasOwnProperty('is_selected') && !question.is_selected[i])) {
return '';
}
usedIndex[shuffledIndex] = true;
const originalIndex = question.hasOwnProperty('choiceIndex') ? question.choiceIndex[shuffledIndex] : (shuffledIndex + 1);
return question.choiceNoList[originalIndex - 1];
});
}









function hasAnswered(type, student_response, is_selected) {
if (student_response == null || student_response.length === 0) {
return false;
}
switch (type) {
case 'sa':
case 'sa-box':
case 'ma':
case 'fill-in':
case 'fill-in-plus':
case 'textarea':
case 'textarea-enquete':
case 'textarea-report':
case 'button':
case 'true-false':
case 'sort':
case 'match':
case 'page':
return true;
case 'wordbank':
case 'pulldown':
for (let i = 0; i < student_response.length; i++) {


if (student_response[i].length === 0 || (typeof is_selected === 'object' && !is_selected[i])) {
return false;
}
}
return true;
case 'fill-in-multi':
for (let i = 0; i < student_response.length; i++) {

if (student_response[i].length === 0) {
return false;
}
}
return true;
}
}

function storeRecoveryData() {
if (_cfg.settings.suspendable === true || _cfg.settings.suspendable === 'true_resume') {
if (lbLocalStorage) {
try {
lbLocalStorage.setItem("18337b0153d9b81df59034995afbf7c49b1ef4bc_recovery_data", generate_suspend_data(true));
} catch (e) {
console.log('storeRecoveryData failed.');
}
}
}
}




function settingSaCorrectInfo(isUpdateUI, studentResponse, correctInfo) {
correctInfo.isCorrect = array_equal(studentResponse, cq.answer);

correctInfo.isCorrect ? correctInfo.correctCount++ : correctInfo.incorrectCount++;

if (isUpdateUI && isQuizUIVisible()) {
for (let i = 0; i < cq.choice.length; i++) {
if (cq.answer.indexOf(cq.choice[i]) >= 0) {

if (_cfg.settings.show_correct_answer) {
$('.choice').eq(i).find('.choice_body').addClass('correct-answer-choice');
}
$('.choice').eq(i).find('label').css('display', 'block');
}
}
}
cq.unknown_flag = studentResponse == 'Not sure';
}




function settingButtonCorrectInfo(studentResponse, correctInfo) {
correctInfo.isCorrect = studentResponse === cq.answer[0];

correctInfo.isCorrect ? correctInfo.correctCount++ : correctInfo.incorrectCount++;
cq.unknown_flag = studentResponse == 'Not sure';
}




function settingTextareaCorrectInfo(studentResponse, correctInfo) {
correctInfo.isCorrect = array_contain([studentResponse], cq.answer);

correctInfo.isCorrect ? correctInfo.correctCount++ : correctInfo.incorrectCount++;
}




function settingTextareaReportCorrectInfo(studentResponse, correctInfo) {
correctInfo.isCorrect = undefined;
correctInfo.undefinedCount++;
}




function settingTextareaEnqueteCorrectInfo(studentResponse, correctInfo) {
if (studentResponse.length === 0) {
correctInfo.isCorrect = false;
correctInfo.incorrectCount++;
} else {
correctInfo.isCorrect = true;
correctInfo.correctCount++;
}
}




function settingFillInMultiCorrectInfo(isUpdateUI, studentResponse, correctInfo) {
if (!studentResponse || studentResponse.length === 0) {
correctInfo.isCorrect = false;
correctInfo.incorrectCount++;
} else {
correctInfo.isCorrect = true;
cq.resultArray = [];

let hasCorrectAnswer = null;
let answerArray = null;

for (let i = 0; i < cq.answer.length; i++) {
hasCorrectAnswer = false;
answerArray = cq.answer[i].split('::');
for (let j = 0; j < answerArray.length; j++) {
if (is_equal(studentResponse[i], answerArray[j])) {
hasCorrectAnswer = true;
}
}
cq.resultArray[i] = hasCorrectAnswer;
if (!hasCorrectAnswer) {
if (isUpdateUI) {
$('.fill_in_multi').eq(i).css('color', 'red');
}
correctInfo.isCorrect = false;
correctInfo.incorrectCount++;
} else {
if (isUpdateUI) {
$('.fill_in_multi').eq(i).css('color', 'green');
}
correctInfo.correctCount++;
}
}
}
}




function settingFillInPlusCorrectInfo(studentResponse, correctInfo) {
correctInfo.isCorrect = array_contain_fillin_plus([studentResponse], cq.answer);

correctInfo.isCorrect ? correctInfo.correctCount++ : correctInfo.incorrectCount++;
}




function settingSortCorrectInfo(isUpdateUI, studentResponse, correctInfo) {
if (isUpdateUI) {
disableDragDrop($('.drag-choice'), $('.drop-choice'));
}
if (studentResponse.length === 0) {
correctInfo.isCorrect = false;
correctInfo.incorrectCount++;
} else {
correctInfo.isCorrect = true;
for (let i = 0; i < studentResponse.length; i++) {
if (studentResponse[i] !== cq.answer[i]) {
correctInfo.isCorrect = false;
break;
}
}

correctInfo.isCorrect ? correctInfo.correctCount++ : correctInfo.incorrectCount++;
}
}




function settingMatchCorrectInfo(isUpdateUI, studentResponse, correctInfo) {
if (isUpdateUI) {
disableDragDrop($('.drag-choice'), $('.drop-choice'));
}
if (studentResponse.length === 0) {
correctInfo.isCorrect = false;
} else {
correctInfo.isCorrect = true;
for (let i = 0; i < studentResponse.length; i++) {
if (
cq.match_key[
cq.answer.findIndex(function (j) {
return j == studentResponse[i];
})
] == cq.match_key[i] ||
studentResponse[i] == cq.answer[i]
) {
correctInfo.correctCount++;

if (
isUpdateUI &&
_cfg.settings.show_instant_result &&
_cfg.settings.show_correct_answer
) {
$('#choice_' + i).find('li').css('color', 'green');
}
} else {
correctInfo.isCorrect = false;
correctInfo.incorrectCount++;

if (
isUpdateUI &&
_cfg.settings.show_instant_result &&
_cfg.settings.show_correct_answer
) {
if ($('#choice_' + i).find('.disp_correct').length === 0) {
const matchAnswer = canUseShortcodeInChoice(cq.type) ? convert_tags(cq.answer[i], { audioKeyPrefix: getKeyPrefixOfLimitedAudio(cq, 'answer', i) }) : cq.answer[i];
$('#choice_' + i)
.find('li')
.css('color', 'red');
$('#choice_' + i)
.find('li')
.append(
"<span class='disp_correct' style='color:green'>（" + matchAnswer + '）</span>'
);
}
}
}
}
}
}




function settingWordBankCorrectInfo(isUpdateUI, studentResponse, correctInfo) {
if (isUpdateUI) {
disableDragDrop($('.drag-choice-wordbank'), $('.drop-choice-wordbank'));
}
if (studentResponse.length === 0) {
correctInfo.isCorrect = false;
} else {
correctInfo.isCorrect = true;
for (let i = 0; i < studentResponse.length; i++) {
if (
_cfg.settings.show_instant_result &&
_cfg.settings.show_correct_answer
) {
if (studentResponse[i] === cq.answer[i] && cq.hasOwnProperty('is_selected') && cq.is_selected[i]) {
if (isUpdateUI) {
$('#question .drag-choice-wordbank').eq(i).css('color', 'green');
}
correctInfo.correctCount++;
} else {
if (isUpdateUI && $('#question .drag-choice-wordbank').eq(i).children('.disp_correct').length === 0) {
const wordbankAnswer = canUseShortcodeInChoice(cq.type) ? convert_tags(cq.answer[i], { audioKeyPrefix: getKeyPrefixOfLimitedAudio(cq, 'answer', i) }) : cq.answer[i];
$('#question .drag-choice-wordbank')
.eq(i)
.css('color', 'red');
$('#question .drag-choice-wordbank')
.eq(i)
.append(
"<span class='disp_correct' style='color:green'>（" + wordbankAnswer + '）</span>'
);
}
correctInfo.isCorrect = false;
correctInfo.incorrectCount++;
}
} else {
if (studentResponse[i] === cq.answer[i] && cq.hasOwnProperty('is_selected') && cq.is_selected[i]) {
correctInfo.correctCount++;
} else {
correctInfo.isCorrect = false;
correctInfo.incorrectCount++;
}
}
}
}
}




function settingPulldownCorrectInfo(isUpdateUI, studentResponse, correctInfo) {
if (isUpdateUI) {
$('option:not(:selected)').attr('disabled', true);
}
if (studentResponse.length === 0) {
correctInfo.isCorrect = false;
} else {
correctInfo.isCorrect = true;

let pulldownAnswer = null;

for (let i = 0; i < studentResponse.length; i++) {
pulldownAnswer = cq.answer[i];
if (
_cfg.settings.show_instant_result &&
_cfg.settings.show_correct_answer
) {
if (studentResponse[i] !== pulldownAnswer || (cq.hasOwnProperty('is_selected') && !cq.is_selected[i])) {
correctInfo.isCorrect = false;
if (isUpdateUI) {
$('select[data-number=' + i + ']').css('color', 'red');
$('select[data-number=' + i + ']').after(
'<span style="color:green">' + htmlencode(pulldownAnswer) + '</div>'
);
}
correctInfo.incorrectCount++;
} else {
if (isUpdateUI) {
$('select[data-number=' + i + ']').css('color', 'green');
}
correctInfo.correctCount++;
}
} else {
if (studentResponse[i] !== pulldownAnswer  || (cq.hasOwnProperty('is_selected') && !cq.is_selected[i])) {
correctInfo.isCorrect = false;
correctInfo.incorrectCount++;
} else {
correctInfo.correctCount++;
}
}
}
}
}




function getCorrectInfo(isUpdateUI, studentResponse) {

let correctInfo = {
isCorrect: null,
correctCount: 0,
incorrectCount: 0,
undefinedCount: 0,
};

switch (cq.type) {
case 'sa':
case 'sa-box':
case 'ma':
settingSaCorrectInfo(isUpdateUI, studentResponse, correctInfo);
break;

case 'button':
case 'true-false':
settingButtonCorrectInfo(studentResponse, correctInfo);
break;

case 'fill-in':
case 'textarea':
settingTextareaCorrectInfo(studentResponse, correctInfo);
break;

case 'textarea-report':
settingTextareaReportCorrectInfo(studentResponse, correctInfo);
break;

case 'textarea-enquete':
settingTextareaEnqueteCorrectInfo(studentResponse, correctInfo);
break;

case 'fill-in-multi':
settingFillInMultiCorrectInfo(isUpdateUI, studentResponse, correctInfo);
break;

case 'fill-in-plus':
settingFillInPlusCorrectInfo(studentResponse, correctInfo);
break;

case 'sort':
settingSortCorrectInfo(isUpdateUI, studentResponse, correctInfo);
break;

case 'match':
settingMatchCorrectInfo(isUpdateUI, studentResponse, correctInfo);
break;

case 'wordbank':
settingWordBankCorrectInfo(isUpdateUI, studentResponse, correctInfo)
break;

case 'pulldown':
settingPulldownCorrectInfo(isUpdateUI, studentResponse, correctInfo)
break;
}


return correctInfo;
}

function getCorrectOneAnswer(q) {
switch (q.type) {
case 'sa':
case 'sa-box':
case 'ma':
case 'sort':
case 'match':
case 'wordbank':
return q.answer;
case 'button':
case 'true-false':
return cq.answer[0];
case 'fill-in':
case 'textarea':
return cq.answer[0];
case 'fill-in-multi':
return q.answer.map(function (a) {
const arr = a.split('::');
return arr[0];
});
case 'fill-in-plus':
return q.answer.map(function (a) {
const arr = a.split(',');
return arr[0];
}).join(',');
case 'pulldown':
return q.answer.map(function (a) {
if (a.match(/\[\[(.*)\]\]/) != null) {
return htmlencode(a.match(/\[\[(.*)\]\]/)[1]);
} else {
return a;
}
});
case 'textarea-report':
case 'textarea-enquete':
case 'page':
return null;
}
}




function getCountAllAnswers() {
return count_incorrect_answers() + count_correct_answers() + count_neutral_answers();
}




function getStudentResponseInitType() {
const typeArrayTbl = [
'sa', 'sa-box', 'ma', 'sort', 'match',
'wordbank', 'fill-in-multi', 'pulldown'
];
return (typeArrayTbl.indexOf(cq.type) >= 1) ? [] : '';
}




function getCorrectnessCount(correctInfo) {
let correctness = null;
if (_cfg.settings.partial_score) {
if (correctInfo.correctCount == 0) {
correctness = [1, 0];
} else {
correctness = [correctInfo.correctCount + correctInfo.incorrectCount, correctInfo.correctCount];
}
} else {
correctness = correctInfo.isCorrect ? [1, 1] : [1, 0];
}
if (correctInfo.undefinedCount && correctInfo.undefinedCount > 0) {
correctness = undefined;
}
return correctness;
}




function settingResult(isResult, isUpdateUI, correctInfo) {
if (isResult) {
if (_cfg.settings.time_limit_mode == 'question') {
$('.timer-frame').contents().find('.timer').countdown('pause');
if (isUpdateUI) {

$('.input').attr('disabled', true);
$('.choice_radio').attr('disabled', true);
$('.choice_checkbox').attr('disabled', true);

$('.md-textarea').attr('readonly', true);
}
}

setResult(correctInfo.isCorrect);
} else {

if (cq.type !== 'page') {
setTempResult(correctInfo.isCorrect);
} else {

setResult(correctInfo.isCorrect);
}
}
}




function settingQuizUI() {
show_feedback();

if (_cfg.settings.show_instant_result) {
if ($('#instant_feedback_msg').html()) {
let height = window.parent.screen.height;
if ($('body').height() < height) {
height = $('body').height();
}
$('#instant_response_disp').css('top', height * 0.6 - 40);
} else {
$('#instant_response_disp').css('top', 150 - 40);
}

if (isQuizUIVisible()) {
$('#instant_response_container').show(1);
$('#instant_response_background').show();
$('#instant_response_container').scrollTop(0);
}

let isNextQuiz = getCountAllAnswers() < _cfg.settings.question_count;

if (isNextQuiz) {
if (has_next_quiz()) {
if (isQuizUIVisible()) {


if (cq.type !== 'page' || !_cfg.settings.movable) {
$('#check_answer_next_button').show();
$('#check_answer_next_button').removeAttr('disabled');
}
}
}
setTimeout(function () {
if ($('#instant_feedback_wrapper').is(':visible')) {
$('#check_answer_next_button').focus();
document.querySelector('#instant_response_container').scrollIntoView();
} else {
document.querySelector('#check_answer_next_button').scrollIntoView(false);
$('#check_answer_next_button').focus();
}
}, 100);
} else {
if (isQuizUIVisible()) {
$('#show_result').show();
$('#abort_quiz').hide();
setTimeout(function () {
if ($('#instant_feedback_wrapper').is(':visible')) {
$('#show_result').focus();
document.querySelector('#instant_response_container').scrollIntoView();
} else {
document.querySelector('#show_result').scrollIntoView(false);
$('#show_result').focus();
}
}, 100);
applyMathJax();
}
}
$('#check_answer_button').hide();
}
}









function check_answer(isAlert, isStore, isResult, isUpdateUI) {



if (isAlert == null) {
isAlert = true;
}
if (isStore == null) {
isStore = true;
}
if (isResult == null) {
isResult = true;
}
if (isUpdateUI == null) {

isUpdateUI = isResult;
}

isUpdateUI = isResult && isUpdateUI;

if (isStore) {
store_answer(isAlert);
}


if (!cq.hasOwnProperty('student_response')) {
cq.student_response = getStudentResponseInitType();
}
if (isAlert && !_cfg.settings.allow_submission_without_answer && !hasAnswered(cq.type, cq.student_response, cq.is_selected)) {

alertNotAnswered(cq.type);
return;
}


const correctInfo = getCorrectInfo(isUpdateUI, cq.student_response);

settingResult(isResult, isUpdateUI, correctInfo);

cq.correctness = getCorrectnessCount(correctInfo);

saveOperationLog();

if (isUpdateUI) {

settingQuizUI();

if (state === 'quiz') {
applyMathJax();
}


update_seigo_counts();

helpToolTipHide();

if (pagination) {
pagination.toggleResultState(cq, position);
}
}

storeRecoveryData();
}






function alertNotAnswered(type) {
switch (type) {
case 'fill-in':
case 'textarea':
case 'textarea-report':
case 'textarea-enquete':
case 'fill-in-multi':
case 'fill-in-plus':
qalert(_cfg.settings.messages.not_filled);
break;
case 'sort':
case 'match':
qalert(_cfg.settings.messages.not_sorted);
break;
default:
qalert(_cfg.settings.messages.not_selected);
break;
}
}

function check_all_answers() {

var i;
store_answer(false);
for (i = 0; i < _cfg.settings.question_count; i++) {
cq = _cfg.questions[i];
position = i;

check_answer(false, false, true, _cfg.settings.show_instant_result);
}
}

function array_equal(a1, a2) {

return array_contain(a1, a2) && array_contain(a2, a1);
}

function array_contain(a1, a2) {

var i, j;
for (i = 0; i < a1.length; i++) {
for (j = 0; j < a2.length; j++) {
if (is_equal(a1[i], a2[j])) {
break;
}
}
if (j === a2.length) {
return false;
}
}
return true;
}

function array_contain_fillin_plus(a1, a2) {

var j, k, subcorrect, answers;
var answers = clone(a2);
for (j = 0; j < answers.length; j++) {
answers[j] = answers[j].split(',');
}
var responseArray = a1[0].split(/[ 　,、，	]+/);
for (j = 0; j < responseArray.length; j++) {
subcorrect = false;
for (k = 0; k < answers.length; k++) {
if (array_contain([responseArray[j]], answers[k])) {
answers.splice(k, 1);
subcorrect = true;
break;
}
}
if (subcorrect == false) return false;
}
return answers.length == 0;
}

function is_equal(a1, a2) {

if (cq.type === 'sa' || cq.type === 'sa-box' || cq.type === 'ma') {
return a1 === a2;
}
if (_cfg.settings.ignore_case) {
a1 = a1.toLowerCase();
a2 = a2.toLowerCase();
}
if (_cfg.settings.ignore_whitespace) {
a1 = a1.replace(/[\s　]+/g, '');
a2 = a2.replace(/[\s　]+/g, '');
}
if (_cfg.settings.ignore_whitespace_count) {
a1 = a1.replace(/[\s　]+/g, ' ');
a2 = a2.replace(/[\s　]+/g, ' ');
}
if (_cfg.settings.ignore_zenhan) {
a1 = hankana2zenkana(zen2han(a1));
a2 = hankana2zenkana(zen2han(a2));
}
if (_cfg.settings.trim) {
a1 = a1.replace(/^[\s　]+|[\s　]+$/g, '');
a2 = a2.replace(/^[\s　]+|[\s　]+$/g, '');
}
a1 = a1.replace(/&#0*58;/g, ':');
a2 = a2.replace(/&#0*58;/g, ':');
return a1 === a2;
}

function zen2han(str, tilde, mark, hankana, space, alpha, num) {
if (alpha !== false) {
str = str.replace(/[Ａ-Ｚａ-ｚ]/g, function (s) {
return String.fromCharCode(s.charCodeAt(0) - 65248);
});
}
if (num !== false) {
str = str.replace(/[０-９]/g, function (s) {
return String.fromCharCode(s.charCodeAt(0) - 65248);
});
}
if (mark !== false) {
var reg = /[！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝]/g;
str = str
.replace(reg, function (s) {
return String.fromCharCode(s.charCodeAt(0) - 65248);
})
.replace(/[‐－―−ーｰ]/g, '-');
}
if (tilde !== false) {
str = str.replace(/[～〜]/g, '~');
}
if (space !== false) {
str = str.replace(/　/g, ' ');
}
if (hankana === true) {
var map = { '。': '｡', '、': '､', '「': '｢', '」': '｣', '・': '･' };
var reg = new RegExp('(' + Object.keys(map).join('|') + ')', 'g');
str = str.replace(reg, function (match) {
return map[match];
});
}

str = str.replace(/‘/g, "'");
str = str.replace(/’/g, "'");
return str;
}
var hankana2zenkana = function (str) {
var kanaMap = {
ｶﾞ: 'ガ',
ｷﾞ: 'ギ',
ｸﾞ: 'グ',
ｹﾞ: 'ゲ',
ｺﾞ: 'ゴ',
ｻﾞ: 'ザ',
ｼﾞ: 'ジ',
ｽﾞ: 'ズ',
ｾﾞ: 'ゼ',
ｿﾞ: 'ゾ',
ﾀﾞ: 'ダ',
ﾁﾞ: 'ヂ',
ﾂﾞ: 'ヅ',
ﾃﾞ: 'デ',
ﾄﾞ: 'ド',
ﾊﾞ: 'バ',
ﾋﾞ: 'ビ',
ﾌﾞ: 'ブ',
ﾍﾞ: 'ベ',
ﾎﾞ: 'ボ',
ﾊﾟ: 'パ',
ﾋﾟ: 'ピ',
ﾌﾟ: 'プ',
ﾍﾟ: 'ペ',
ﾎﾟ: 'ポ',
ｳﾞ: 'ヴ',
ﾜﾞ: 'ヷ',
ｦﾞ: 'ヺ',
ｱ: 'ア',
ｲ: 'イ',
ｳ: 'ウ',
ｴ: 'エ',
ｵ: 'オ',
ｶ: 'カ',
ｷ: 'キ',
ｸ: 'ク',
ｹ: 'ケ',
ｺ: 'コ',
ｻ: 'サ',
ｼ: 'シ',
ｽ: 'ス',
ｾ: 'セ',
ｿ: 'ソ',
ﾀ: 'タ',
ﾁ: 'チ',
ﾂ: 'ツ',
ﾃ: 'テ',
ﾄ: 'ト',
ﾅ: 'ナ',
ﾆ: 'ニ',
ﾇ: 'ヌ',
ﾈ: 'ネ',
ﾉ: 'ノ',
ﾊ: 'ハ',
ﾋ: 'ヒ',
ﾌ: 'フ',
ﾍ: 'ヘ',
ﾎ: 'ホ',
ﾏ: 'マ',
ﾐ: 'ミ',
ﾑ: 'ム',
ﾒ: 'メ',
ﾓ: 'モ',
ﾔ: 'ヤ',
ﾕ: 'ユ',
ﾖ: 'ヨ',
ﾗ: 'ラ',
ﾘ: 'リ',
ﾙ: 'ル',
ﾚ: 'レ',
ﾛ: 'ロ',
ﾜ: 'ワ',
ｦ: 'ヲ',
ﾝ: 'ン',
ｧ: 'ァ',
ｨ: 'ィ',
ｩ: 'ゥ',
ｪ: 'ェ',
ｫ: 'ォ',
ｯ: 'ッ',
ｬ: 'ャ',
ｭ: 'ュ',
ｮ: 'ョ',
'｡': '。',
'､': '、',
'｢': '「',
'｣': '」',
'･': '・'
};


var reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');
return str
.replace(reg, function (match) {
return kanaMap[match];
})
.replace(/ﾞ/g, '゛')
.replace(/ﾟ/g, '゜');
};


function show_feedback() {

$('.input').attr('disabled', true);
$('.choice_radio').attr('disabled', true);
$('.choice_checkbox').attr('disabled', true);

$('.md-textarea').attr('readonly', true);

if (drawingboard) drawingboard.disable();

if (fileSubmission) fileSubmission.disable();


if ((_cfg.settings.show_instant_result && state === 'quiz') || state === 'quiz_review') {
$('#instant_response_container').show(1);
$('#instant_response_background').show();
$('#instant_response_container').scrollTop(0);
if (cq.result === 'neutral') {
response_disp(true);
$('#instant_result_msg').html(_cfg.settings.messages.correct);
$('#instant_result_wrapper').show();
} else if (cq.result === 'correct') {
response_disp(true);
$('#instant_result_msg').html(_cfg.settings.messages.correct);
$('#instant_result_wrapper').show();
if (isQuizUIVisible()) {
$('#answer_mark_correct').show();
}
} else {
response_disp(true);
$('#instant_result_msg').html(_cfg.settings.messages.incorrect);
$('#instant_result_wrapper').show();
if (isQuizUIVisible()) {
$('#answer_mark_incorrect').show();
}
if (_cfg.settings.show_correct_answer && isQuizUIVisible() && cq.type !== 'sa' && cq.type !== 'sa-box' && cq.type !== 'ma') {
$('#instant_answer_msg').html(formatter(cq, 'answer', canUseShortcodeInChoice(cq.type)));
$('#instant_answer_wrapper').show();
}
}
}
show_ox_fb();
show_sa_fb();


addMediaEvent(_cfg.settings.sound == false);
}

function show_sa_fb() {

if (cq.type === 'sa' || cq.type === 'sa-box' || cq.type === 'button' || cq.type === 'true-false') {
if (cq.feedback_map[cq.student_response]){
$('#instant_feedback_msg').html(
convert_tags(cq.feedback_map[cq.student_response], { audioKeyPrefix: getKeyPrefixOfLimitedAudio(cq, 'feedback_map', cq.choice_no) })
);
$('#instant_feedback_wrapper').show();
} else {

if (cq.is_feedback_one) {

const feedback = cq.feedback_map[Object.keys(cq.feedback_map)[0]];
$('#instant_feedback_msg').html(convert_tags(feedback), { audioKeyPrefix: getKeyPrefixOfLimitedAudio(cq, 'feedback_map', cq.choiceNoList[0]) });
$('#instant_feedback_wrapper').show();
} else {

$('#instant_feedback_wrapper').hide();
}
}
}
}

function show_ox_fb() {

if (cq.result === 'correct') {
if (cq.hasOwnProperty('feedback_tf') && cq.feedback_tf[0]) {
$('#instant_feedback_msg').html(convert_tags(cq.feedback_tf[0]), { audioKeyPrefix: getKeyPrefixOfLimitedAudio(cq, 'feedback_tf', 0) });
$('#instant_feedback_wrapper').show();
}
} else {
if (cq.hasOwnProperty('feedback_tf') && cq.feedback_tf[1]) {
$('#instant_feedback_msg').html(convert_tags(cq.feedback_tf[1]), { audioKeyPrefix: getKeyPrefixOfLimitedAudio(cq, 'feedback_tf', 1) });
$('#instant_feedback_wrapper').show();
}
}
}

function play_correct_sound() {

if (_cfg.settings.sound) {
document.getElementById('correct_sound').load();
document.getElementById('correct_sound').play();
}
}

function play_incorrect_sound() {

if (_cfg.settings.sound) {
document.getElementById('incorrect_sound').load();
document.getElementById('incorrect_sound').play();
}
}

function play_dragged_sound() {

if (_cfg.settings.sound) {
document.getElementById('dragged_sound').load();
document.getElementById('dragged_sound').play();
}
}

function setTempResult(is_correct) {

if (cq.type === 'page') {
cq.tempResult = 'neutral';
return;
}
if (!cq.hasOwnProperty('result')) {
if (is_correct === undefined) {
cq.tempResult = 'neutral';
} else {
cq.tempResult = is_correct ? 'correct' : 'incorrect';
}
}
}

function setResult(is_correct) {

if (cq.hasOwnProperty('result')) {

return;
}
if (cq.type === 'page') {
cq.result = 'neutral';
return;
}
if (is_correct === undefined) {
cq.result = 'neutral';
} else if (is_correct) {
cq.result = 'correct';
cq.correct_count++;
if (_cfg.settings.show_instant_result && state === 'quiz') {
play_correct_sound();
}
} else {
if (cq.student_response && cq.student_response.length > 0) {
cq.result = 'incorrect';
cq.incorrect_count++;
} else {
cq.result = 'incorrect';
}
if (_cfg.settings.show_instant_result && state === 'quiz') {
play_incorrect_sound();
}
}
}
function response_disp(disp_flg) {

if (disp_flg) {
$('#instant_response_background').css('opacity', '1');
$('#instant_result_wrapper').css('opacity', '1');
$('#instant_answer_wrapper').css('opacity', '1');
$('#instant_feedback_wrapper').css('opacity', '1');
$('#instant_response_disp').hide();
$('#instant_response_disp_none').show();
$('#instant_response_container').css('overflow-y', 'auto');
$('#answer_mark').show();
} else {
$('#instant_response_background').css('opacity', '0.01');
$('#instant_result_wrapper').css('opacity', '0.01');
$('#instant_answer_wrapper').css('opacity', '0.01');
$('#instant_feedback_wrapper').css('opacity', '0.01');
$('#instant_response_disp').show();
$('#instant_response_disp_none').hide();
$('#instant_response_container').css('overflow-y', 'visible');
$('#answer_mark').hide();
}
}

function check_choiced_next_quiz() {

if (has_next_quiz()) {

check_answer(true, true, false);

if (!hasAnswered(cq.type, cq.student_response, cq.is_selected)) {
return;
}
display_next_quiz();
}
}

function mark_quiz() {

var is_all_question_answered, i, q;
if (!_cfg.settings.show_instant_result) {
if (
!_cfg.settings.movable &&
position + 1 === _cfg.settings.question_count
) {

check_answer(true, true, false);

if (!hasAnswered(cq.type, cq.student_response, cq.is_selected)) {
return;
}
} else {

check_answer(false, true, false);
}
is_all_question_answered = true;
for (i = 0; i < _cfg.settings.question_count; i++) {
q = _cfg.questions[i];
if (!hasAnswered(q.type, q.student_response, q.is_selected)) {
is_all_question_answered = false;
}
}
if (!is_all_question_answered && _cfg.settings.time_limit_mode != 'question') {
if (!confirm(_cfg.settings.messages.confirm_midstream_mark)) {
return;
}
} else if (_cfg.settings.movable) {
if (!confirm(_cfg.settings.messages.confirm_mark)) {
return;
}
}
show_result();
}
}


function show_list() {

pushed_state = state;
store_answer(false);
cstate('list');
$('#result_table tbody').empty();
make_result_table('#result_table1');
show('#page_list');
helpToolTipHide();
$('#page_list div.scrollbartable').remove();
applyMathJax();


addMediaEvent(true);
}

function moveFromList(num) {

moveQuiz(position, num, function () { hide_list(num); });
}






function make_result_table(selector) {

$('.result_detail').remove();

let result_detail_record;
let displayCount = 0; // 表示上の設問の番号
for (let i = 0; i < _cfg.settings.question_count; i++) {

cq = _cfg.questions[i];

if (cq.type !== 'page') displayCount++;

if (selector === '#result_table1') {

result_detail_record = $(result_detail_template1).clone();

$('.list_to_quiz', result_detail_record).on('click', function () { moveFromList(i); });

$('.list_to_quiz', result_detail_record).prop('disabled', !movableBySectionReturnRule(position, i));
} else {

result_detail_record = $(result_detail_template2).clone();

$('.review_quiz', result_detail_record).on('click', function () { reviewFromResult(i); });
}

const detailData = {
no: '',
studentResponse: '',
result: '',
scoreStr: '',
};


detailData.no = cq.type === 'page' ? '<i class="far fa-comment-dots"></i>' : displayCount.toString();
$('.no', result_detail_record).html(detailData.no);


const hasStudentResponse =
cq.hasOwnProperty('student_response') &&
cq.student_response !== '' &&
cq.student_response !== false;
if (cq.type === 'page') {
detailData.studentResponse = '-';
} else if (hasStudentResponse) {
detailData.studentResponse = formatter(cq, 'student_response', canUseShortcodeInChoice(cq.type));
if (cq.hasOwnProperty('hasMastered')) {

detailData.studentResponse = wrap_hasMastered_div(detailData.studentResponse);
}
}
$('.student_response', result_detail_record).html(detailData.studentResponse);


const hasResult =
cq.hasOwnProperty('result') &&
cq.result !== '' &&
(selector !== '#result_table1' || _cfg.settings.show_instant_result);
if (cq.type === 'page') {
detailData.result = '-';
} else if (hasResult) {
if (fraction.toDouble(cq.correctness) > 0 && fraction.toDouble(cq.correctness) < 1) {
detailData.result = _cfg.settings.messages['sankaku'];
} else {
detailData.result = _cfg.settings.messages[cq.result];
}
if (cq.hasOwnProperty('hasMastered')) {

detailData.result = wrap_hasMastered_div(detailData.result);
}
}
$('.result', result_detail_record).html(detailData.result);


const scoreWeight = _cfg.settings.score_weighting
? cq.weight
: 100 / _cfg.settings.question_scoring_count | 0;
if (cq.type === 'page' || cq.hasOwnProperty('ignoreFromScoring')) {

detailData.scoreStr = '-';
} else if (cq.result === 'neutral') {
detailData.scoreStr = 'Waiting for scoring';
} else if (cq.hasOwnProperty('result')) {
if (cq.type == 'textarea-report') {
detailData.scoreStr = cq.scoreStr = '?/' + floor2ndDecimal(scoreWeight);
} else {
detailData.scoreStr = cq.scoreStr =
floor2ndDecimal(fraction.toDouble(fraction.mul([1, scoreWeight], cq.correctness))) + '/' + floor2ndDecimal(scoreWeight);
}
} else {
detailData.scoreStr = '?/' + floor2ndDecimal(scoreWeight);
}
$('.scoreStr', result_detail_record).html(detailData.scoreStr);


$(result_detail_record).addClass(getResultClassName(cq));

$(selector + ' tbody').append(result_detail_record);
}

if (!_cfg.settings.show_instant_result) {
$('.scoreStr').remove();
}
}

function getResultClassName(question) {
if (!question.hasOwnProperty('result')) {
return '';
}
if (isPartial(question)) {
return 'partial';
}
const classNameMap = { correct: 'correct', incorrect: 'wrong', neutral: 'waiting' };
return (classNameMap.hasOwnProperty(question.result) && question.type !== 'page') ? classNameMap[question.result] : '';
}

function isPartial(question) {
if (!question.hasOwnProperty('result') || !question.hasOwnProperty('correctness')) {
return false;
}
return question.result === 'incorrect' && question.correctness[1] > 0;
}








function formatter(q, elem, convert) {

if (convert == null) {
convert = true;
}
var dispAnswerArray, i, answers, j, k, ansArray;
if (elem == 'student_response') {
if (q[elem] == 'Not sure') {
return 'Pass';
}


if (q.drawingboard && q[elem]) {
return '<img src="' + q[elem] + '" class="drawingboard-image" />';
}


if (q.file_submission && q[elem]) {
const fileSubmissionData = JSON.parse(q[elem]);
let html = '<div>'
html += (convert ? convert_tags(htmlencode(String(fileSubmissionData.content))) : htmlencode(String(fileSubmissionData.content))).replace(
/\n/g,
'<br>'
);
html += '</div>';
if (Array.isArray(fileSubmissionData.files) && fileSubmissionData.files.length > 0) {
fileSubmissionData.files.forEach(function (file) {
html += '<kbd style="display:inline-block;background-color:#f39c12;margin:10px 10px 0 0;"><i class="far fa-paperclip"></i> ' + htmlencode(file.name) + '</kbd>';
});
}
return html;
}
}
if (q.type === 'true-false') {
if (q[elem][0] === 'true' || q[elem] === 'true') {
return 'True';
}
if (q[elem][0] === 'false' || q[elem] === 'false') {
return 'False';
}
return convert ? convert_tags(String(q[elem]), { audioKeyPrefix: getKeyPrefixOfLimitedAudio(q, elem) }) : String(q[elem]);
}
if (q.type === 'fill-in-multi') {
if (elem == 'answer') {
dispAnswerArray = [];
k = 0;
for (i = 0; i < q[elem].length; i++) {
answers = q[elem][i].split('::');
if (!q.resultArray || q.resultArray[i] == false) {
for (j = 0; j < answers.length; j++) {
if (j === 0) {
dispAnswerArray[k] = htmlencode(answers[j]);
} else {
dispAnswerArray[k] = htmlencode(dispAnswerArray[k]) + '(' + htmlencode(answers[j]) + ')';
}
}
if (q.label && q.label[i]) {
dispAnswerArray[k] = htmlencode(q.label[i]) + '.' + dispAnswerArray[k];
}
k++;
}
}
return convert ? convert_tags(dispAnswerArray.join(', ')) : dispAnswerArray.join(', ');
}
}
if (typeof q[elem] === 'object') {
if (q.type === 'fill-in-plus' && elem === 'answer') {
answers = q[elem];
dispAnswerArray = new Array(answers.length);
for (i = 0; i < answers.length; i++) {
ansArray = answers[i].split(',');
for (j = 0; j < ansArray.length; j++) {
if (j === 0) {
dispAnswerArray[i] = htmlencode(ansArray[j]);
} else {
dispAnswerArray[i] = dispAnswerArray[i] + '(' + htmlencode(ansArray[j]) + ')';
}
}
}
return convert ? convert_tags(dispAnswerArray.join(', ')) : dispAnswerArray.join(', ');
}
if (Array.isArray(q[elem])) {
if (q.type === 'ma') {
return convert
? q[elem].map(function (el, i) { return convert_tags(String(el), { audioKeyPrefix: getKeyPrefixOfLimitedAudio(q, elem, i) }); }).join(' ,<br>')
: q[elem].map(function (el, i) { return addKeyToLimitedAudio(String(el), getKeyPrefixOfLimitedAudio(q, elem, i))}).join(' ,<br>');
} else {

elemArray = q[elem].concat();

if (elem === 'student_response' && (q.type === 'fill-in-multi' || q.type === 'pulldown')) {
for (i = 0; i < elemArray.length; i++) {
elemArray[i] = htmlencode(elemArray[i]);
}
}

if (elem === 'answer' && (q.type === 'fill-in' || q.type === 'pulldown')) {
for (i = 0; i < elemArray.length; i++) {
elemArray[i] = htmlencode(elemArray[i]);
}
}
return convert
? elemArray.map(function (el, i) { return convert_tags(String(el), { audioKeyPrefix: getKeyPrefixOfLimitedAudio(q, elem, i) }); }).join(', ')
: elemArray.map(function (el, i) { return addKeyToLimitedAudio(String(el), getKeyPrefixOfLimitedAudio(q, elem, i))}).join(', ');
}
}
} else {
if (q[elem] === undefined) {
return '-';
}
if (elem == 'student_response') {
if (q.type == 'button') {
return (convert ? convert_tags(String(q[elem]), { audioKeyPrefix: getKeyPrefixOfLimitedAudio(q, 'student_response')}) : String(q[elem])).replace(/\n/g, '<br>');
} else {
return (convert ? convert_tags(htmlencode(String(q[elem])), { audioKeyPrefix: getKeyPrefixOfLimitedAudio(q, 'student_response')}) : htmlencode(String(q[elem]))).replace(
/\n/g,
'<br>'
);
}
} else {
return String(q[elem]);
}
}
}

function hide_list(num) {


check_answer(false, true, false);

previousPosition = position;
if (num !== undefined) {
position = num;
}

cstate(pushed_state);
if (state === 'quiz' || state === 'feedback') {
show('#page_quiz');
display_quiz();


if (pagination) {
pagination.updatePagination();
}

if (drawingboard) {
drawingboard.resize();
}
} else if (state === 'result') {
show('#page_result');
}

$('#back_to_question').tooltip('hide');
}










function show_result(options) {

pauseAllMedias(null, null);


options = $.extend(
false,
{
isResultsAtStart: false,
overridesQuestions: null,
origProgress: null,
},
options != null ? options : {}
);
if (state === 'result') {
return;
}
if (state === 'quiz_review') {
cstate('result');
show('#page_result');
$('#choices').empty();
$('#question').empty();

addMediaEvent(true);
return;
}
cstate('result');
finished = true;


if (pagination && (options.overridesQuestions != null || _cfg.settings.show_answers_so_far)) {
pagination.destroy();
pagination = null;
}


if (options.overridesQuestions != null) {
_cfg.questions = options.overridesQuestions;

if (options.origProgress != null) {

origProgress = options.origProgress;
}


settingDisplayPositions();

delete _cfg.settings.question_count_array;
delete _cfg.settings.question_count;
settingQuestionCount();
$('#question_count').html(_cfg.settings.question_not_page_count);
}

if (options.isResultsAtStart) {

updateStartButtonAndGraphUI('#page_result');
$('.page_result--start_button_list').show();
$('.page_result--restart_button_list').hide();


$('#timer_wrap_quiz').hide();
} else {
if (localStorage) localStorage.removeItem("18337b0153d9b81df59034995afbf7c49b1ef4bc_recovery_data");
const $timer = $('.timer-frame').contents().find('.timer');
$timer.countdown('destroy');
$timer.remove();
$('.timer_wrapper').remove();
$('#timer_wrap_quiz .tooltip-common').remove();
}

$('#choices').empty();
$('#question').empty();
if (!options.isResultsAtStart && options.overridesQuestions == null) {



check_all_answers();

try {
save_suspend_data();
} catch (e) {
console.log('IE and Edge do not support localStorage with local file.');
}
} else {





$('body').attr('data-is-before-quiz', '1');
}
const score = get_score();
if (count_neutral_answers_not_page()) {
$('.score').html('Waiting for scoring');
} else {
if (_cfg.settings.score_weighting) {
$('.score').html(floor2ndDecimal(get_normal_score()) + 'pt');
} else {
$('.score').html(
floor2ndDecimal(get_normal_score()) +
'pt' + '(' +
count_correct_answers() +
' ' + 'out of' + ' ' +
_cfg.settings.question_scoring_count +
')'
);
}
}

const result = get_result();
$('td.result').html(_cfg.settings.messages[result]);

$('#page_result').attr('data-result', result);
if (_cfg.settings.finish_at_result_page && !options.isResultsAtStart && options.overridesQuestions == null) {

finalize_scorm();
}


if (_cfg.settings.show_answers_so_far) {

const askedQuestionsQuizIdMap = {};
_cfg.questions.forEach(function (q) {
askedQuestionsQuizIdMap[q.quiz_id] = true;
});
initializedConfig.questions.forEach(function (q, i) {

if (Object.prototype.hasOwnProperty.call(askedQuestionsQuizIdMap, q.quiz_id)) return;

if (!Object.prototype.hasOwnProperty.call(masteredQuestionsQuizIdMap, q.quiz_id)) return;

if (q.type === 'textarea-report' || q.type === 'textarea-enquete') return;


_cfg.questions.push(q);
position = _cfg.questions.length - 1;
cq = _cfg.questions[position];
cq.student_response = getCorrectOneAnswer(cq);
formattedQuestion(position, cq.section);

cq.hasMastered = true;

cq.ignoreFromScoring = true;

cq.result = 'correct';
cq.correctness = [1, 1];
});


settingDisplayPositions();

delete _cfg.settings.question_count_array;
delete _cfg.settings.question_count;
settingQuestionCount();
$('#question_count').html(_cfg.settings.question_not_page_count);
}

if (_cfg.settings.mode == 'normal') {
$('.passing_score').html(_cfg.settings.passing_score + 'pt');
$('#summary_table_normal').show();
$('#summary_table_master').hide();
} else {
$('.passing_score').html(_cfg.settings.passing_score + '%');
$('#summary_table_normal').hide();
$('#summary_table_master').show();
$('.progressBody').html(origProgress + '%→' + score + '%');
}
make_result_table('#result_table2');
if (_cfg.settings.hide_result_summary) {
$('#summary_table_normal').hide();
$('#summary_table_master').hide();
}
if (_cfg.settings.hide_result_detail) {
$('#result_table2').hide();
}
if (result === 'passed') {
if (
_cfg.settings.messages.passed_title !== false ||
_cfg.settings.messages.passed_body !== false
) {
$('#message_passed_head').show();
if (_cfg.settings.messages.passed_title !== false) {
$('#messages_passed_title').html(convert_tags(_cfg.settings.messages.passed_title));
}
if (_cfg.settings.messages.passed_body !== false) {
$('#messages_passed_body').html(convert_tags(_cfg.settings.messages.passed_body));
}
} else {
$('#messages_passed_head').hide();
}
if (_cfg.settings.certificate) {
$('#goto_certificate_button').show();
$('#restart_button').hide();
} else {
$('#goto_certificate_button').hide();
}
} else if (result === 'completed') {
if (
_cfg.settings.messages.waiting_for_grading_title !== false ||
_cfg.settings.messages.failed_body !== false
) {
$('#message_passed_head').show();
if (_cfg.settings.messages.waiting_for_grading_title !== false) {
$('#messages_passed_title').html(convert_tags(_cfg.settings.messages.waiting_for_grading_title));
}
if (_cfg.settings.messages.waiting_for_grading_body !== false) {
$('#messages_passed_body').html(convert_tags(_cfg.settings.messages.waiting_for_grading_body));
}
} else {
$('#message_passed_head').hide();
}
$('#goto_certificate_button').hide();
} else {
if (
_cfg.settings.messages.failed_title !== false ||
_cfg.settings.messages.failed_body !== false
) {
$('#message_passed_head').show();
if (_cfg.settings.messages.failed_title !== false) {
$('#messages_passed_title').html(convert_tags(_cfg.settings.messages.failed_title));
}
if (_cfg.settings.messages.failed_body !== false) {
$('#messages_passed_body').html(convert_tags(_cfg.settings.messages.failed_body));
}
} else {
$('#message_passed_head').hide();
}
$('#goto_certificate_button').hide();
}
show('#page_result');
applyMathJax();


addMediaEvent(true);
}






function start_quiz_from_result(mode) {

initializeGlobalState();


$('#timer_wrap_quiz').show();
$('.list').show();
helpToolTipShowFromResult();


if (pagination) {
pagination.destroy();
pagination = null;
}


$('body').removeAttr('data-is-before-quiz');

init_quiz({ isFromResultPage: true, targetMode: mode });
}

function count_correct_answers() {

var count = 0,
i;
for (i = 0; i < _cfg.settings.question_count; i++) {
if (_cfg.questions[i].result === 'correct') {
count++;
}
}
return count;
}

function count_incorrect_answers() {

var count = 0,
i;
for (i = 0; i < _cfg.settings.question_count; i++) {
if (_cfg.questions[i].result === 'incorrect') {
count++;
}
}
return count;
}

function count_neutral_answers() {

var count = 0,
i;
for (i = 0; i < _cfg.settings.question_count; i++) {
if (_cfg.questions[i].result === 'neutral') {
count++;
}
}
return count;
}


function count_neutral_answers_not_page() {

var count = 0,
i;
for (i = 0; i < _cfg.settings.question_count; i++) {
if (_cfg.questions[i].result === 'neutral' && _cfg.questions[i].type !== 'page') {
count++;
}
}
return count;
}

function get_normal_score() {

if (_cfg.settings.score_weighting === true) {
return get_weighted_score();
} else {
return get_unweighted_score();
}
}

function get_weighted_score() {

var score = [1, 0],
i;
for (i = 0; i < _cfg.settings.question_count; i++) {
if (_cfg.questions[i].correctness === undefined) {
return undefined;
}
score = fraction.add(score, fraction.mul([1, _cfg.questions[i].weight], _cfg.questions[i].correctness))
}
return fraction.toDouble(score);
}

function get_unweighted_score() {

if (_cfg.settings.question_scoring_count === 0) return 0;
var score = [1, 0],
i;
for (i = 0; i < _cfg.settings.question_count; i++) {
if (_cfg.questions[i].correctness === undefined) {
return undefined;
}
score = fraction.add(score, _cfg.questions[i].correctness);
}
return fraction.toDouble(fraction.div(fraction.mul([1, 100], score), [1, _cfg.settings.question_scoring_count]))
}

function get_score() {

try {
if (_cfg.settings.mode == 'normal') {
return get_normal_score();
} else if (_cfg.settings.mode == 'master') {
var i,
suspend_data = API.GetValue('cmi.suspend_data'),
suspend_data_body,
correct_count = 0,
question_count = 0,
suspend_data_array = JSON.parse(suspend_data);
suspend_data_body = suspend_data_array['counts'];
for (i = 0; i < suspend_data_body.length; i += 4) {
correct_count += parseInt(suspend_data_body.substring(i, i + 2), 10);
question_count += _cfg.settings.master_count;
}
return Math.round((correct_count / question_count) * 100);
}
alert('invalid mode:' + _cfg.settings.mode);
} catch (e) {
console.log('get score failed');
return 0;
}
}

function get_scaled_score() {

return get_score() / 100;
}

function get_result() {

if (_cfg.settings.mode == 'master') {
return get_score() >= _cfg.settings.passing_score ? 'passed' : 'incomplete';
} else {
if (get_score() === undefined) {
return 'completed'; //レポート問題が含まれている場合はcompletedとし、learningBOXで採点を行う
} else {
return get_score() >= _cfg.settings.passing_score ? 'passed' : 'failed';
}
}
}

function restart() {

location.href = location.href;
}


var API, APIVersion, startTime;
function DummyAPI() {

var seed = '18337b0153d9b81df59034995afbf7c49b1ef4bc';
this.dummy = true;
this.Initialize = function () {
console_log('Initialize');
};
this.Terminate = function () {
console_log('Terminate');
};
this.Commit = function () {
console_log('Commit');
};
this.SetValue = function (key, value) {
console_log('SetValue(' + key + ', ' + value + ')');
if (key === 'cmi.suspend_data') {
try {
lbLocalStorage.setItem(key + seed, value);
} catch (e) {
console.log("DummyAPI: setValue('cmi.suspend_data') failed");
}
}
};
this.GetValue = function (key) {
console_log('GetValue(' + key + ')');
if (key === 'cmi.suspend_data') {
return lbLocalStorage.getItem(key + seed);
}
};
}

function WrapperAPI_12to2004(api12) {

this.Initialize = function (str) {
return api12.LMSInitialize(str);
};
this.Terminate = function (str) {
return api12.LMSFinish(str);
};
this.Commit = function (str) {
return api12.LMSCommit(str);
};
this.SetValue = function (key, value) {
return api12.LMSSetValue(key, value);
};
this.GetValue = function (key) {
return api12.LMSGetValue(key);
};
this.GetLastError = function () {
return api12.LMSGetLastError('');
};
}

function init_scorm() {

var win1, win2;
try {
win1 = window;
try {
while (win1.API == null && win1.parent != null && win1.parent != win1) {
win1 = win1.parent;
}
} catch (e) {
console.log('e12');
}
win2 = window;
try {
while (
win2.API_1484_11 == null &&
win2.parent != null &&
win2.parent != win2
) {
win2 = win2.parent;
}
} catch (e) {
console.log('e2004');
}
if (
(_cfg.settings.scorm === 'auto' || _cfg.settings.scorm === '1.2') &&
win1.API !== undefined
) {
API = new WrapperAPI_12to2004(win1.API);
_cfg.settings.scorm = '1.2';
console_log('SCORM 1.2 API found');
} else if (
(_cfg.settings.scorm === 'auto' || _cfg.settings.scorm === '2004') &&
win2.API_1484_11 !== undefined
) {
API = win2.API_1484_11;
_cfg.settings.scorm = '2004';
console_log('SCORM 2004 API found');
} else {
throw 'No API Found';
}
} catch (e) {

API = new DummyAPI();
_cfg.settings.scorm = 'dummy';
console_log('SCORM API not found. DummyAPI loaded.');
}
API.Initialize('');
API.SetValue('cmi.core.session_time', formatTimeIntervalForSCORM12(0));
if (_cfg.settings.scorm === '1.2') {
setValue('cmi.core.lesson_status', 'browsed');
commit();
}
if (_cfg.settings.scorm === '2004') {
setValue('cmi.completion_status', 'incomplete');
commit();
}

APIVersion = _cfg.settings.scorm;

$(window).on('unload', function () {
if (localStorage) {
localStorage.removeItem("18337b0153d9b81df59034995afbf7c49b1ef4bc_recovery_data");
}
});



if (isIOS() || isIPadOS() || isAndroid() || isFirefox()) {
$(window).on('pagehide', function () {
sendResult();
});
} else {
$(window).on('beforeunload', function () {
sendResult();
});
}

try {
load_suspend_data();
} catch (e) {
console_log(e);
console_log('Failed to load suspend data');
}
}

const sendResult = function () {
if (state == 'quiz' || state == 'list') {

let isSuspend = true;

if (_cfg.settings.suspendable) {

if (1 <= _cfg.settings.suspendable_count && _cfg.settings.suspendable_count <= 99) {
isSuspend = currentSuspendCount <= _cfg.settings.suspendable_count;
}
}

if (_cfg.settings.suspendable && isSuspend) {

check_answer(false, true, false);
cstate('suspended');
} else {

cstate('unload_check_answer');
check_answer(true, true, false);
cstate('unload');
check_all_answers();
}
save_suspend_data();
finalize_scorm();
}
}

function sendCommonInteractions(q, i) {

setValue('cmi.interactions.' + i + '.id', q.id);
if (q.type === 'sa' || q.type === 'sa-box' || q.type === 'ma' || q.type === 'button') {
setValue('cmi.interactions.' + i + '.type', 'choice');
} else if (q.type === 'true-false') {
setValue('cmi.interactions.' + i + '.type', 'true-false');
} else if (q.type === 'fill-in') {
setValue('cmi.interactions.' + i + '.type', 'fill-in');
} else if (q.type === 'textarea') {
setValue('cmi.interactions.' + i + '.type', 'textarea');
} else if (q.type === 'textarea-enquete') {
setValue('cmi.interactions.' + i + '.type', 'textarea-enquete');
if (q.drawingboard && q.hasOwnProperty('student_response') && q.student_response.length > 0) {

setValue('cmi.interactions.' + i + '.student_response_format', 'data:image');
} else if (q.file_submission && q.hasOwnProperty('student_response') && q.student_response.length > 0) {

setValue('cmi.interactions.' + i + '.student_response_format', 'textarea-json');
}
} else if (q.type === 'textarea-report') {
setValue('cmi.interactions.' + i + '.type', 'textarea-report');
if (q.drawingboard && q.hasOwnProperty('student_response') && q.student_response.length > 0) {

setValue('cmi.interactions.' + i + '.student_response_format', 'data:image');
} else if (q.file_submission && q.hasOwnProperty('student_response') && q.student_response.length > 0) {

setValue('cmi.interactions.' + i + '.student_response_format', 'textarea-json');
}
} else if (q.type === 'fill-in-plus') {
setValue('cmi.interactions.' + i + '.type', 'fill-in');
} else if (q.type === 'fill-in-multi') {
setValue('cmi.interactions.' + i + '.type', 'fill-in');
} else if (q.type === 'sort') {
setValue('cmi.interactions.' + i + '.type', 'sequencing');
} else if (q.type === 'match') {
setValue('cmi.interactions.' + i + '.type', 'matching');
} else if (q.type === 'wordbank') {
setValue('cmi.interactions.' + i + '.type', 'matching');
} else if (q.type === 'pulldown') {
setValue('cmi.interactions.' + i + '.type', 'pulldown');
} else if (q.type === 'page') {
setValue('cmi.interactions.' + i + '.type', 'page');
}
setValue('cmi.interactions.' + i + '.original_type', q.type);


let interactionsChildren = getValue('cmi.interactions._children');

if (_cfg.settings.score_weighting) {
setValue('cmi.interactions.' + i + '.weighting', q.weight);

if (interactionsChildren && interactionsChildren.indexOf('isWeightingEmpty') != -1) {
setValue('cmi.interactions.' + i + '.isWeightingEmpty', q.weight == 0 ? 'true' : 'false');
}
} else {
if (q.type !== 'page') {
setValue('cmi.interactions.' + i + '.weighting', '1');
} else {
setValue('cmi.interactions.' + i + '.weighting', '0');
}

if (interactionsChildren && interactionsChildren.indexOf('isWeightingEmpty') != -1) {
setValue('cmi.interactions.' + i + '.isWeightingEmpty', 'true');
}
}
if (_cfg.settings.scorm === '1.2') {
if (q.hasOwnProperty('latency')) {
setValue(
'cmi.interactions.' + i + '.latency',
formatTimeIntervalForSCORM12(q.latency * 100)
);
} else {
setValue(
'cmi.interactions.' + i + '.latency',
formatTimeIntervalForSCORM12(0)
);
}
} else {
if (q.hasOwnProperty('latency')) {
setValue(
'cmi.interactions.' + i + '.latency',
formatTimeIntervalForSCORM2004(q.latency * 100)
);
} else {
setValue(
'cmi.interactions.' + i + '.latency',
formatTimeIntervalForSCORM2004(0)
);
}
}
setValue('cmi.interactions.' + i + '.correct_responses.0.pattern', q.answer);
}

function finalize_scorm() {

var q,
i = 0,
hasReport = false;
if (API === null) {
return;
}
for (i = 0; i < _cfg.settings.question_count; i++) {
if (_cfg.questions[i].type === 'textarea-report') {
hasReport = true;
}
}
if (_cfg.settings.scorm === '1.2') {
const coreChildren = getValue('cmi.core._children');
if (coreChildren && coreChildren.indexOf('event') != -1) {
setValue('cmi.core.event', 'ended');
}
for (i = 0; i < _cfg.settings.question_count; i++) {
q = _cfg.questions[i];
sendCommonInteractions(q, i);
var tempNum = 0;
for (var j = 0; j < q.section_tag.length; j++) {
if (q.section_tag[j]) {
setValue(
'cmi.interactions.' + i + '.objectives.' + j + '.id',
's:' + q.section_tag[j]
);
}
tempNum++;
}
for (var j = 0; j < q.question_tag.length; j++) {
if (q.question_tag[j]) {
setValue(
'cmi.interactions.' + i + '.objectives.' + (j + tempNum) + '.id',
'q:' + q.question_tag[j]
)
}
}
setValue(
'cmi.interactions.' + i + '.student_response',
q.type !== 'page' ? q.student_response : ''
);
if (q.hasOwnProperty('choice_no')) {
setValue('cmi.interactions.' + i + '.choice_no', q.choice_no);
}
if (q.hasOwnProperty('section_no') && q.hasOwnProperty('non_section') && !q.non_section) {
setValue('cmi.interactions.' + i + '.section_no', q.section_no);
}
if (!q.hasOwnProperty('time')) {
q.time = getCurrentTimeForSCORM12();
}
setValue('cmi.interactions.' + i + '.time', q.time);
if (
fraction.toDouble(q.correctness) == 0 ||
fraction.toDouble(q.correctness) == 1 ||
q.correctness === undefined
) {
setValue('cmi.interactions.' + i + '.result', scorm12[q.result ? q.result : q.tempResult]);
} else {
setValue(
'cmi.interactions.' + i + '.result',
floor2ndDecimal(fraction.toDouble(q.correctness) * 100)
);
}
}
if (hasReport) {
setValue('cmi.comments', JSON.stringify({ mode: 'report' }));
} else {
setValue('cmi.comments', JSON.stringify({ mode: _cfg.settings.mode }));
}
if (get_score() !== undefined) {
if (state == 'suspended') {
setValue('cmi.core.score.raw', 0);
} else {
if (_cfg.settings.rounding_setting_of_score === 'round') {
setValue('cmi.core.score.raw', Math.round(get_score()));
} else {
setValue('cmi.core.score.raw', Math.floor(get_score()));
}
}
}
setValue('cmi.core.score.min', '0');
setValue('cmi.core.score.max', '100');
if (state == 'intro' || state == 'loading') {
setValue('cmi.core.lesson_status', 'browsed');
} else if (state == 'suspended') {
setValue('cmi.core.lesson_status', 'incomplete');
} else {
setValue('cmi.core.lesson_status', get_result());
}
setValue(
'cmi.core.session_time',
formatTimeIntervalForSCORM12(new Date().getTime() - startTime)
);
} else {
for (i = 0; i < _cfg.settings.question_count; i++) {
q = _cfg.questions[i];
sendCommonInteractions(q, i);
setValue(
'cmi.interactions.' + i + '.learner_response',
q.type !== 'page' ? q.student_response : ''
);
if (q.hasOwnProperty('choice_no')) {
setValue('cmi.interactions.' + i + '.choice_no', q.choice_no);
}
if (q.hasOwnProperty('section_no') && q.hasOwnProperty('non_section') && !q.non_section) {
setValue('cmi.interactions.' + i + '.section_no', q.section_no);
}
if (!q.hasOwnProperty('time')) {
q.time = getCurrentTimeForSCORM2004();
}
setValue('cmi.interactions.' + i + '.timestamp', q.time);
if (
fraction.toDouble(q.correctness) == 0 ||
fraction.toDouble(q.correctness) == 1 ||
q.correctness === undefined
) {
setValue('cmi.interactions.' + i + '.result', scorm2004[q.result ? q.result : q.tempResult]);
} else {
setValue(
'cmi.interactions.' + i + '.result',
floor2ndDecimal(fraction.toDouble(q.correctness) * 100)
);
}
}
if (hasReport) {
setValue('cmi.comments', JSON.stringify({ mode: 'report' }));
} else {
setValue('cmi.comments', JSON.stringify({ mode: _cfg.settings.mode }));
}
setValue('cmi.score.scaled', get_scaled_score().toFixed(3));

if (state == 'intro' || state == 'loading') {
setValue('cmi.success_status', 'unknown');
setValue('cmi.completion_status', 'not attempted');
} else if (state == 'suspended') {
setValue('cmi.success_status', 'unknown');
setValue('cmi.completion_status', 'incomplete');
} else {
setValue('cmi.success_status', get_result());
setValue('cmi.completion_status', 'completed');
}
setValue(
'cmi.session_time',
formatTimeIntervalForSCORM2004(new Date().getTime() - startTime)
);
}
API.Terminate('');
API = null;
}


function floor2ndDecimal(val) {
return Math.floor(val * 10) / 10;
}


function round2ndDecimal(val) {
return Math.round(val * 10) / 10;
}

function formatTimeIntervalForSCORM12(diff) {

var h, m, s;
s = (diff - (diff % 1000)) / 1000;
m = (s - (s % 60)) / 60;
h = (m - (m % 60)) / 60;
s = s - m * 60;
m = m - h * 60;
if (h < 10) {
h = '0' + h;
}
if (m < 10) {
m = '0' + m;
}
if (s < 10) {
s = '0' + s;
}
return h + ':' + m + ':' + s;
}

function formatTimeIntervalForSCORM2004(diff) {

return formatTimeIntervalForSCORM12(diff);
}

function setValue(key, value) {

if (typeof value === 'object') {
API.SetValue(key, value.join(', '));
} else if (value === undefined) {
API.SetValue(key, '');
} else {
API.SetValue(key, String(value));
}
}

function getValue(key) {

return API.GetValue(key);
}

function commit() {

if (API !== null) {
API.Commit('');
}
}

function getCurrentTimeForSCORM12() {

var ctime = new Date(),
h = ctime.getHours(),
m = ctime.getMinutes(),
s = ctime.getSeconds();
if (h < 10) {
h = '0' + h;
}
if (m < 10) {
m = '0' + m;
}
if (s < 10) {
s = '0' + s;
}
return h + ':' + m + ':' + s;
}

function getCurrentTimeForSCORM2004() {

return getCurrentTimeForSCORM12();
}


let preventKeydownEvent = false;
window.document.onkeydown = function (e) {

if (preventKeydownEvent) return;
e = e || window.event;
if (e.altKey || e.ctrlKey) return;

const code = e.keyCode || e.which;

const enterKey = 13;
if (code === enterKey) {
if (state === 'quiz') {
if (
cq.type == 'textarea' ||
cq.type == 'textarea-enquete' ||
cq.type == 'textarea-report'
) {

} else {
if (_cfg.settings.show_instant_result) {
if ($(':focus').attr('id') !== 'check_answer_button') {
if (!cq.hasOwnProperty('result')) {
check_answer(true, true, true);
}

if (
$(':focus').attr('id') !== 'check_answer_next_button' &&
$(':focus').attr('id') !== 'show_result'
) {
return false;
}
}
} else if (!_cfg.settings.movable) {
if (
$(':focus').attr('id') !== 'not_disp_answer_next_button' &&
$(':focus').attr('id') !== 'not_disp_answer_mark_button'
) {
check_choiced_next_quiz();
}
} else if (_cfg.settings.movable) {
if ($(':focus').attr('id') === 'display_prev_quiz') {
display_prev_quiz();
} else {
display_next_quiz();
}
}
}
} else if (state === 'intro') {

if (document.activeElement.localName !== 'button') {
start_quiz();
}
}
} else if (code >= 49 && code <= 57) {
numkey(code - 48);
} else if (code >= 97 && code <= 105) {
numkey(code - 96);
} else if (_cfg.settings.movable) {
if (
state === 'quiz' &&
((cq.type !== 'fill-in' &&
cq.type !== 'fill-in-plus' &&
cq.type !== 'fill-in-multi' &&
cq.type !== 'textarea' &&
cq.type !== 'textarea-enquete' &&
cq.type !== 'textarea-report') ||
e.shiftKey ||
(cq.hasOwnProperty('result') && cq.result !== ''))
) {

const isExamVertical = _cfg.settings.layout === 'exam-vertical';
if (code === 37) {
const move = isExamVertical ? display_next_quiz : display_prev_quiz;
move();
} else if (code === 39) {
const move = isExamVertical ? display_prev_quiz : display_next_quiz;
move();
}
}
}
};

function numkey(num) {

if (state === 'quiz' && !cq.hasOwnProperty('result')) {
if (
num <= $('.choice input').length + $('.choice button').length ||
(cq.type === 'true-false' && num <= 2)
) {
if (cq.type === 'sa' || cq.type === 'sa-box') {
$('.choice input')[num - 1].checked = 'checked';
} else if (cq.type === 'ma') {
$('.choice input')[num - 1].checked = !$('.choice input')[num - 1]
.checked;
} else if (cq.type === 'button') {
button_click(cq.choice[num - 1]);
} else if (cq.type === 'true-false') {
button_click(num === 1 ? 'true' : 'false');
}
}
}
}


var merge = function (p, q) {

var o = q,
z;
for (z in p) {
if (p.hasOwnProperty(z)) {
if (typeof p[z] === 'object' && typeof o[z] === 'object') {
o[z] = merge(p[z], o[z]);
} else {
o[z] = p[z];
}
}
}
return o;
},
clone = function (obj) {

var F = function () { };
F.prototype = obj;
return new F();
},
htmlencode = function (s) {

return s
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;');
},
jsencode = function (s) {

return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
},
unescapeHtml = function (target) {
if (typeof target !== 'string') return target;

const patterns = {
'&lt;': '<',
'&gt;': '>',
'&amp;': '&',
'&quot;': '"',
'&#x27;': '\'',
'&#x60;': '`'
};

return target.replace(/&(lt|gt|amp|quot|#x27|#x60);/g, function (match) {
return patterns[match];
});
},
qalert = function (msg) {

if (state === 'quiz') {
alert(msg);
}
},
console_log = function (msg) {

if (typeof console != 'undefined') {
console.log(msg);
}
},
wrap_div = function (str) {

return '<div class="break-word">' + str + '</div>';
},
wrap_hasMastered_div = function (str) {

return '<div class="has-mastered">' + str + '</div>';
},
cstate = function (new_state) {

state = new_state;
},
show = function (sel) {

$('.page').hide();
$(sel).fadeIn(0);
};

Array.prototype.shuffle = function () {

var i = this.length;
let j;
let tmp;
let index = [];
for (j = 0; j < i; j++){
index[j] = j+1;
}
while (i) {
j = Math.floor(Math.random() * i);
tmp = this[--i];
this[i] = this[j];
this[j] = tmp;
tmp = index[i];
index[i] = index[j];
index[j] = tmp;
}
return index;
};

function _getFlashObject() {

return document.getElementById('myFlash');
}

function play($file) {

try {
_getFlashObject().SetVariable('method:setUrl', $file);
_getFlashObject().SetVariable('method:play', '');
} catch (e) {
console_log('error: loading flash');
}
}

function pause() {

_getFlashObject().SetVariable('method:pause', '');
}

function stop() {

_getFlashObject().SetVariable('method:stop', '');
}

function setDivHeight() {

var max_height = 0,
max_outerHeight,
connection_height;
if (cq.type === 'sort') {
$('.drag-choice').each(function () {
if (max_height < $(this).height()) {
max_height = $(this).height();
}
});
$('.drag-choice').each(function () {
$(this).css('min-height', max_height);
$(this).css('max-width', $(this).width());
});
}
}

function setDragDropEvent() {

var dragObject, changeLi, former_list;
if (cq.type !== 'wordbank') {
dragObject = $('.drag-choice');
} else {
dragObject = $('.drag-choice-wordbank');
}
setClickEvent(dragObject,cq.type);
dragObject.each(function () {
$(this).draggable({
revert: true,
revertDuration: 0,
start: function () {
$(this).css('visibility', 'hidden');
},
stop: function () {
$(this).css('visibility', 'visible');
},
drag: function (event, ui) {
if (isIOS()) {
if (top.pageYOffset - ui.position.top < 50) {
if (top.pageYOffset > ui.position.top - 10) {
top.scrollTo(0, ui.position.top - 10);
}
}
if (ui.position.top - top.pageYOffset > top.innerHeight - 200) {
top.scrollTo(0, ui.position.top - top.innerHeight + 200);
}
}
},
appendTo: 'body',
helper: 'clone'

});
$(this).hover(
function () {
$(this).addClass('list-hover');
dragObject.not(this).removeClass('list-hover');
},
function () {
if (!$(this).hasClass('ui-draggable-dragging')) {
$(this).removeClass('list-hover');
}
}
);
});
if (cq.type === 'wordbank') {
$('.drop-choice-wordbank').each(function () {
$(this).droppable({
hoverClass: 'drop-hover',
drop: function (event, ui) {
if ($(this).children().length === 1) {
if (ui.draggable.parents('.drop-choice-wordbank').length === 1) {
ui.draggable
.prevAll('.wordbank-key')
.css('display', 'inline-block');
ui.draggable.appendTo(this);
$(this)
.find('.wordbank-key')
.css('display', 'none');
} else {
ui.draggable
.parent('#choices .drop-choice-list')
.css('display', 'none');
ui.draggable.appendTo(this);
$(this)
.find('.wordbank-key')
.css('display', 'none');
}
} else {
if (ui.draggable.parents('.drop-choice-wordbank').length === 1) {
ui.draggable.after($(this).find('.drag-choice-wordbank'));
ui.draggable.appendTo(this);
} else {
changeLi = $(this).find('.drag-choice-wordbank');
$('#choices .drop-choice-list')
.eq(changeLi.find('.drop-index').text())
.css('display', 'inline-block');
$('#choices .drop-choice-list')
.eq(changeLi.find('.drop-index').text())
.append(changeLi);
ui.draggable
.parent('#choices .drop-choice-list')
.css('display', 'none');
ui.draggable.appendTo(this);
}
}
ui.draggable.css('left', '');
ui.draggable.css('top', '');
play_dragged_sound();

setInitializeClick();
}
});
});
$('#choices').droppable({
drop: function (event, ui) {
ui.draggable.prevAll('.wordbank-key').css('display', 'inline-block');
$('#choices .drop-choice-list')
.eq(ui.draggable.find('.drop-index').text())
.css('display', 'inline-block');
$('#choices .drop-choice-list')
.eq(ui.draggable.find('.drop-index').text())
.append(ui.draggable);
ui.draggable.css('left', '');
ui.draggable.css('top', '');
play_dragged_sound();

setInitializeClick();
}
});
} else {
$('.drop-choice').each(function () {
$(this).droppable({
hoverClass: 'drop-hover',
drop: function (event, ui) {
$(this)
.find('li')
.removeClass('list-hover');
former_list = $(this).find('li');
ui.draggable.after($(this).find('li'));
$(this).append(ui.draggable);
ui.draggable.css('left', '');
ui.draggable.css('top', '');
change_sort_flg = true;
changelist_animation(ui.draggable, former_list);
play_dragged_sound();

setInitializeClick();
}
});
});
}
}

function setDragDropList() {

let template, displist, choice_value, choice_html, i;
if (cq.type === 'sort') {
template = sort_template;
} else if (cq.type === 'match') {
template = match_template;
}
let propertyName;
if (cq.student_response && cq.student_response.length > 0) {
change_sort_flg = true;
displist = cq.student_response;
propertyName = 'student_response';
} else {
change_sort_flg = false;
displist = cq.choice;
propertyName = 'choice';
}
const convert = canUseShortcodeInChoice(cq.type);
for (i = 0; i < displist.length; i++) {
choice_value = convert ? convert_tags(
displist[i],
{ audioKeyPrefix: getKeyPrefixOfLimitedAudio(cq, propertyName, i) }
) : displist[i];
choice_html = template;
if (cq.type === 'match') {
choice_html = choice_html.replace(/\[\[choice\]\]/g, choice_value);
choice_html = choice_html.replace(
/\[\[match_key\]\]/g,
convert ? convert_tags(cq.match_key[i]) : cq.match_key[i]
);
choice_html = choice_html.replace(/\[\[choice_id\]\]/g, 'choice_' + i);
} else {
choice_html = choice_html.replace(/\[\[choice\]\]/g, choice_value);
}
choice_html = choice_html.replace(
/\[\[choice_key\]\]/g,
htmlencode(displist[i])
);
choice_html = '<div class="choice">' + choice_html + '</div>';
$('#choices').append(choice_html);
}
}


function isQuizUIVisible() {
return state == 'quiz' || state == 'quiz_review';
}

function disableDragDrop(dragobj, dropobj) {

dragobj.each(function () {
$(this).draggable('disable');
$(this)
.unbind('mouseenter')
.unbind('mouseleave');

$(this).css('pointer-events','none');
});
dropobj.each(function () {
$(this).droppable('disable');

$(this).css('pointer-events','none');
});
}

function is_shuffle(a1, a2) {

var i;
for (i = 1; i < a1.length; i++) {
if (a1[0] !== a1[i]) {
break;
}
if (i === a1.length - 1) {
return true;
}
}
for (i = 0; i < a1.length; i++) {
if (a1[i] !== a2[i]) {
break;
}
if (i === a1.length - 1) {
return false;
}
}
return true;
}

function is_shuffled_match(a1, a2, match_key) {
var aa1 = [],
aa2 = [],
i;
for (i = 0; i < a1.length; i++) {
aa1.push(
match_key[
a1.findIndex(function (j) {
return j == a1[i];
})
]
);
aa2.push(
match_key[
a1.findIndex(function (j) {
return j == a2[i];
})
]
);
}
return is_shuffle(aa1, aa2);
}

function changelist_animation(list1, list2) {

list1.css('left', '20px');
list2.css('left', '20px');
list1.animate(
{
left: '0px'
},
100
);
list2.animate(
{
left: '0px'
},
100
);
setTimeout(function () {
list1.css('background-color', 'white');
}, 100);
setTimeout(function () {
list1.css('background-color', '');
}, 300);
setTimeout(function () {
list2.css('background-color', 'white');
}, 100);
setTimeout(function () {
list2.css('background-color', '');
}, 300);
}

function gotoCertificate() {
window.open(
'https://quizgenerator.net/certificate/?type=' + _cfg.settings.certificate
);
}

function suspend() {
const timer = $('.timer-frame').contents().find('.timer');
timer.countdown('pause');
if (window.confirm('Are you sure to pause the session?')) {

pauseAllMedias(null, null);
timer.countdown('destroy');
check_answer(false, true, false);
cstate('suspended');
show('#page_suspended');
save_suspend_data();
finalize_scorm();
helpToolTipHide();
} else {
timer.countdown('resume');
}
}


setInterval(function () {
if (typeof cq == 'undefined') {
return;
}



if (typeof cq.result == 'undefined' || (cq.type === 'page' && (state === 'quiz' || state === 'list'))) {
if (cq.hasOwnProperty('latency')) {
cq.latency++;
} else {
cq.latency = 1;
}
}
}, 100);

var initPhotoSwipeFromDOM = function (gallerySelector) {
var parseThumbnailElements = function (el) {
var thumbElements = el.childNodes,
numNodes = thumbElements.length,
items = [],
figureEl,
linkEl,
size,
item;
for (var i = 0; i < numNodes; i++) {
figureEl = thumbElements[i];
if (figureEl.nodeType !== 1) {
continue;
}
linkEl = figureEl.children[0];
sizeStr = imgSize[linkEl.getAttribute('href')];
size = sizeStr.split('x');
item = {
src: linkEl.getAttribute('href'),
w: parseInt(size[0], 10),
h: parseInt(size[1], 10)
};
if (figureEl.children.length > 1) {
item.title = figureEl.children[1].innerHTML;
}
if (linkEl.children.length > 0) {
item.msrc = linkEl.children[0].getAttribute('src');
}
item.el = figureEl;
items.push(item);
}
return items;
};
var closest = function closest(el, fn) {
return el && (fn(el) ? el : closest(el.parentNode, fn));
};
var onThumbnailsClick = function (e) {
e = e || window.event;
e.preventDefault ? e.preventDefault() : (e.returnValue = false);
var eTarget = e.target || e.srcElement;
var clickedListItem = closest(eTarget, function (el) {
return el.tagName && el.tagName.toUpperCase() === 'FIGURE';
});
if (!clickedListItem) {
return;
}
var clickedGallery = clickedListItem.parentNode,
childNodes = clickedListItem.parentNode.childNodes,
numChildNodes = childNodes.length,
nodeIndex = 0,
index;
for (var i = 0; i < numChildNodes; i++) {
if (childNodes[i].nodeType !== 1) {
continue;
}
if (childNodes[i] === clickedListItem) {
index = nodeIndex;
break;
}
nodeIndex++;
}
if (index >= 0) {
openPhotoSwipe(index, clickedGallery);
}
e.stopPropagation();
return false;
};

var photoswipeParseHash = function () {
var hash = window.location.hash.substring(1),
params = {};
if (hash.length < 5) {
return params;
}
var vars = hash.split('&');
for (var i = 0; i < vars.length; i++) {
if (!vars[i]) {
continue;
}
var pair = vars[i].split('=');
if (pair.length < 2) {
continue;
}
params[pair[0]] = pair[1];
}
if (params.gid) {
params.gid = parseInt(params.gid, 10);
}
if (!params.hasOwnProperty('pid')) {
return params;
}
params.pid = parseInt(params.pid, 10);
return params;
};
var openPhotoSwipe = function (index, galleryElement, disableAnimation) {
var pswpElement = document.querySelectorAll('.pswp')[0],
gallery,
options,
items;
items = parseThumbnailElements(galleryElement);
options = {
index: index,
galleryUID: galleryElement.getAttribute('data-pswp-uid'),
getThumbBoundsFn: function (index) {
var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
pageYScroll =
window.pageYOffset || document.documentElement.scrollTop,
rect = thumbnail.getBoundingClientRect();
if (rect.width !== 0) {
return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
}


rect = items[index].el.getElementsByTagName('a')[0].getBoundingClientRect();
return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 + pageYScroll, w: 0 };
},
history: false,
};
if (disableAnimation) {
options.showAnimationDuration = 0;
}
gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);


gallery.listen('beforeChange', function () {
preventKeydownEvent = true;
});
gallery.listen('close', function () {
preventKeydownEvent = false;
});

gallery.init();
};
var galleryElements = document.querySelectorAll(gallerySelector);

for (var i = 0, l = galleryElements.length; i < l; i++) {
galleryElements[i].setAttribute('data-pswp-uid', i + 1);
galleryElements[i].onclick = onThumbnailsClick;
}
var hashData = photoswipeParseHash();
if (hashData.pid > 0 && hashData.gid > 0) {
openPhotoSwipe(hashData.pid - 1, galleryElements[hashData.gid - 1], true);
}
};
var photo;
setTimeout(function () {
photo = initPhotoSwipeFromDOM('.my-gallery');
}, 500);

function reviewFromResult(_position) {
cstate('quiz_review');
show('#page_quiz');


if (_cfg.settings.movable && !_cfg.settings.hide_pagination && !pagination) {
pagination = new Pagination('#pagination', _cfg.questions);
$('#question_count_wrapper').hide();
} else {
$('#question_count_wrapper+.tooltip-common').remove();
}

if (pagination) {
pagination.allQuestionToggleAnswerState();
}

position = _position;
display_quiz();
$('.list').hide();
helpToolTipHideFromResult();
}

if (!Array.prototype.findIndex) {
Array.prototype.findIndex = function (predicate) {
if (this === null) {
throw new TypeError(
'Array.prototype.findIndex called on null or undefined'
);
}
if (typeof predicate !== 'function') {
throw new TypeError('predicate must be a function');
}
var list = Object(this);
var length = list.length >>> 0;
var thisArg = arguments[1];
var value;

for (var i = 0; i < length; i++) {
value = list[i];
if (predicate.call(thisArg, value, i, list)) {
return i;
}
}
return -1;
};
}


getSectionQuizMaxArray = function (save_questionData) {
let sectionArray = [];
let currentSection = 0;
let count = 0;

for (i = 0; i < save_questionData.length; i++) {
count++;

if (i + 1 == save_questionData.length) {
sectionArray.push(count);
break;
}

if (currentSection != save_questionData[i + 1].section) {
sectionArray.push(count);

currentSection = save_questionData[i + 1].section;
count = 0;
}
}

return sectionArray;
};





var fraction = {}
fraction.gcd = function (x, y) {
x = Math.abs(x);
y = Math.abs(y);
while (y) {
var t = y;
y = x % y;
x = t;
}
return x;
}

fraction.reduce = function (num) {
var gcdNum = fraction.gcd(num[0], num[1]);
return [num[0] / gcdNum, num[1] / gcdNum];
}

fraction.mul = function (num1, num2) {
return fraction.reduce([num1[0] * num2[0], num1[1] * num2[1]]);
}

fraction.div = function (num1, num2) {
return fraction.reduce([num1[0] * num2[1], num1[1] * num2[0]]);
}

fraction.add = function (num1, num2) {
return fraction.reduce([num1[0] * num2[0], num1[0] * num2[1] + num2[0] * num1[1]]);
}

fraction.tofrac = function (n) {
return [1, n];
}

fraction.toDouble = function (num) {
if (num) {
return num[1] / num[0];
} else {
return 0;
}
}


var LZString = function () { function o(o, r) { if (!t[o]) { t[o] = {}; for (var n = 0; n < o.length; n++)t[o][o.charAt(n)] = n } return t[o][r] } var r = String.fromCharCode, n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", t = {}, i = { compressToBase64: function (o) { if (null == o) return ""; var r = i._compress(o, 6, function (o) { return n.charAt(o) }); switch (r.length % 4) { default: case 0: return r; case 1: return r + "==="; case 2: return r + "=="; case 3: return r + "=" } }, decompressFromBase64: function (r) { return null == r ? "" : "" == r ? null : i._decompress(r.length, 32, function (e) { return o(n, r.charAt(e)) }) }, compressToUTF16: function (o) { return null == o ? "" : i._compress(o, 15, function (o) { return r(o + 32) }) + " " }, decompressFromUTF16: function (o) { return null == o ? "" : "" == o ? null : i._decompress(o.length, 16384, function (r) { return o.charCodeAt(r) - 32 }) }, compressToUint8Array: function (o) { for (var r = i.compress(o), n = new Uint8Array(2 * r.length), e = 0, t = r.length; t > e; e++) { var s = r.charCodeAt(e); n[2 * e] = s >>> 8, n[2 * e + 1] = s % 256 } return n }, decompressFromUint8Array: function (o) { if (null === o || void 0 === o) return i.decompress(o); for (var n = new Array(o.length / 2), e = 0, t = n.length; t > e; e++)n[e] = 256 * o[2 * e] + o[2 * e + 1]; var s = []; return n.forEach(function (o) { s.push(r(o)) }), i.decompress(s.join("")) }, compressToEncodedURIComponent: function (o) { return null == o ? "" : i._compress(o, 6, function (o) { return e.charAt(o) }) }, decompressFromEncodedURIComponent: function (r) { return null == r ? "" : "" == r ? null : (r = r.replace(/ /g, "+"), i._decompress(r.length, 32, function (n) { return o(e, r.charAt(n)) })) }, compress: function (o) { return i._compress(o, 16, function (o) { return r(o) }) }, _compress: function (o, r, n) { if (null == o) return ""; var e, t, i, s = {}, p = {}, u = "", c = "", a = "", l = 2, f = 3, h = 2, d = [], m = 0, v = 0; for (i = 0; i < o.length; i += 1)if (u = o.charAt(i), Object.prototype.hasOwnProperty.call(s, u) || (s[u] = f++, p[u] = !0), c = a + u, Object.prototype.hasOwnProperty.call(s, c)) a = c; else { if (Object.prototype.hasOwnProperty.call(p, a)) { if (a.charCodeAt(0) < 256) { for (e = 0; h > e; e++)m <<= 1, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++; for (t = a.charCodeAt(0), e = 0; 8 > e; e++)m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1 } else { for (t = 1, e = 0; h > e; e++)m = m << 1 | t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t = 0; for (t = a.charCodeAt(0), e = 0; 16 > e; e++)m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1 } l--, 0 == l && (l = Math.pow(2, h), h++), delete p[a] } else for (t = s[a], e = 0; h > e; e++)m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1; l--, 0 == l && (l = Math.pow(2, h), h++), s[c] = f++, a = String(u) } if ("" !== a) { if (Object.prototype.hasOwnProperty.call(p, a)) { if (a.charCodeAt(0) < 256) { for (e = 0; h > e; e++)m <<= 1, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++; for (t = a.charCodeAt(0), e = 0; 8 > e; e++)m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1 } else { for (t = 1, e = 0; h > e; e++)m = m << 1 | t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t = 0; for (t = a.charCodeAt(0), e = 0; 16 > e; e++)m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1 } l--, 0 == l && (l = Math.pow(2, h), h++), delete p[a] } else for (t = s[a], e = 0; h > e; e++)m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1; l--, 0 == l && (l = Math.pow(2, h), h++) } for (t = 2, e = 0; h > e; e++)m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1; for (; ;) { if (m <<= 1, v == r - 1) { d.push(n(m)); break } v++ } return d.join("") }, decompress: function (o) { return null == o ? "" : "" == o ? null : i._decompress(o.length, 32768, function (r) { return o.charCodeAt(r) }) }, _decompress: function (o, n, e) { var t, i, s, p, u, c, a, l, f = [], h = 4, d = 4, m = 3, v = "", w = [], A = { val: e(0), position: n, index: 1 }; for (i = 0; 3 > i; i += 1)f[i] = i; for (p = 0, c = Math.pow(2, 2), a = 1; a != c;)u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1; switch (t = p) { case 0: for (p = 0, c = Math.pow(2, 8), a = 1; a != c;)u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1; l = r(p); break; case 1: for (p = 0, c = Math.pow(2, 16), a = 1; a != c;)u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1; l = r(p); break; case 2: return "" }for (f[3] = l, s = l, w.push(l); ;) { if (A.index > o) return ""; for (p = 0, c = Math.pow(2, m), a = 1; a != c;)u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1; switch (l = p) { case 0: for (p = 0, c = Math.pow(2, 8), a = 1; a != c;)u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1; f[d++] = r(p), l = d - 1, h--; break; case 1: for (p = 0, c = Math.pow(2, 16), a = 1; a != c;)u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1; f[d++] = r(p), l = d - 1, h--; break; case 2: return w.join("") }if (0 == h && (h = Math.pow(2, m), m++), f[l]) v = f[l]; else { if (l !== d) return null; v = s + s.charAt(0) } w.push(v), f[d++] = s + v.charAt(0), h--, s = v, 0 == h && (h = Math.pow(2, m), m++) } } }; return i }(); "function" == typeof define && define.amd ? define(function () { return LZString }) : "undefined" != typeof module && null != module && (module.exports = LZString);

if (localStorage) {
var lbLocalStorage = {};
lbLocalStorage.getItem = function (key) {
var value = localStorage.getItem(key);
if (value && value.substring(0, 2) == "LB") {
return LZString.decompress(value.substring(2));
} else {
return value;
}
}
lbLocalStorage.setItem = function (key, value) {
var compressedValue = LZString.compress(value);
return localStorage.setItem(key, 'LB' + compressedValue);
}
}


const helpElementsId = '#suspend_button_wrapper, #hide_list_button, #display_next_quiz, #display_prev_quiz, #display_next_explanation_page, #display_prev_explanation_page, #not_disp_answer_mark_button, #seigo_count';
const helpElementsArray = ['#suspend_button_wrapper', '#hide_list_button', '#display_next_quiz', '#display_prev_quiz', '#display_next_explanation_page', '#display_prev_explanation_page', '#not_disp_answer_mark_button', '#seigo_count'];

function isTouchDevice() {
const hasTouchEvent = window.ontouchstart === null ? true : false
return hasTouchEvent;
}


function notTouchDeviceHoverAction() {
$(helpElementsId).hover(
function () {
if ($(this).css('display') !== 'none') {
$(this).next('.tooltip-common').css('display', 'block');
}
},
function () {
$(this).next('.tooltip-common').css('display', 'none');
}
);
$('#pagination').hover(
function () {
$('#question_count_wrapper').next('.tooltip-common').css('display', 'block');
},
function () {
$('#question_count_wrapper').next('.tooltip-common').css('display', 'none');
}
);
$('#timer_wrap_quiz').hover(
function () {
$('#timer_wrap_quiz .tooltip-common').css('display', 'block');
},
function () {
$('#timer_wrap_quiz .tooltip-common').css('display', 'none');
}
);
}


$(function () {
if (!isTouchDevice()) {
notTouchDeviceHoverAction();
}
});


function helpToolTipShow() {
$('.tooltip-wrapper .tooltip-common').addClass('tooltip-visible');
helpElementsArray.forEach(function (helpId) {
if ($(helpId).css('display') == 'none') {
$(helpId + '+ .tooltip-common').removeClass('tooltip-visible');
}
})

$('#help_button_show').tooltip('hide');
$('#help_button_show').hide();
$('#help_button_hide').show();
};


function helpToolTipHide() {
$('.tooltip-wrapper .tooltip-common').removeClass('tooltip-visible');
$('#help_button_show').show();
$('#help_button_hide').hide();
};


function helpToolTipHideFromResult() {

$('.col.order-md-1.flex-end').hide();
}


function helpToolTipShowFromResult() {

$('.col.order-md-1.flex-end').show();
}





const removeChecked = function () {
const $this = $(this);
const thisValue = $this.val();

if (thisValue === window.checkedValue) {
$this.prop('checked', false);
const unique = new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16);
window.checkedValue = unique;
return;
}
window.checkedValue = thisValue;
}





const checkSelectionLimit = function () {
const limit = window.cq.answer.length;
const selectedNumber = $('.choice_checkbox:checked').length;

if (selectedNumber > limit) {
alert('You cannot select any more answers.');
$(this).prop('checked', false);
}
}






let choiceSel = -1;
let beforeAnswerSel = -1;
let beforePosition = false;
let answerSel = false;
let dropSel = false;
let dropArea = false;
function setClickEvent(dragObject,type) {
if (beforeAnswerSel > -1){

beforeAnswerSel = -1;
}
if (type == 'wordbank') {
dragObject.each(function (index) {
$(this).attr('choice-num',index);
$(this).on('click', function(){
choiceSel = $(this).attr('choice-num');
if (beforeAnswerSel == choiceSel) {

$(this).fadeTo(100, 1, function(){
beforeAnswerSel = -1;
});
} else if (beforeAnswerSel == -1) {

if (dropSel && choiceSel){

if ($(this).parent().is($('.drop-choice-wordbank'))){
$(this).parent()
.find('.wordbank-key')
.css('display', 'inline-block');
} else {
$("#choices > .drop-choice-list:eq(" + choiceSel + ")").css('display','none');
}
$(beforePosition).css('display', 'none');
$(this).appendTo($(beforePosition).parent());
setInitializeClick()
return false;
} else {

$(this).fadeTo(100, 0.5, function(){
beforeAnswerSel = choiceSel;

beforePosition = $(this).parent();
});
}
} else if (beforeAnswerSel > -1){
dropArea = $('.drop-choice-wordbank').find(".drag-choice-wordbank[choice-num= " + beforeAnswerSel + "]");
if (dropArea.length > 0){

if ($(this).parent().is($('.drop-choice-wordbank'))){

$(dropArea).appendTo($(this).parent());
} else {

$(dropArea).appendTo($("#choices > .drop-choice-list:eq(" + beforeAnswerSel + ")"));
$("#choices > .drop-choice-list:eq(" + choiceSel + ")").css('display','none');
$("#choices > .drop-choice-list:eq(" + beforeAnswerSel + ")").css('display','inline-block');
}
$(beforePosition.context).css('opacity',1);

$(this).appendTo($(beforePosition));
setInitializeClick();
return false;
} else {

if ($(this).parent().is($('.drop-choice-list'))){

$(".drag-choice-wordbank[choice-num= " + beforeAnswerSel + "]").fadeTo(100, 1, function(){
$(".drag-choice-wordbank[choice-num= " + choiceSel + "]").fadeTo(100, 0.5, function(){
beforeAnswerSel = choiceSel;
});
});
}
}
}
});
});
$('.drop-choice-wordbank').each(function (index) {
$(this).attr('answer-num',index);
$(this).on('click', function(){
answerSel = $(this).children('.drag-choice-wordbank').attr('choice-num');
if (beforeAnswerSel > -1 && beforeAnswerSel !== answerSel){

if ($(this).children('.drag-choice-wordbank').length > 0){


$("#choices > .drop-choice-list:eq(" + answerSel + ")").css('display','inline-block');
$($('#choices').find(".drag-choice-wordbank[choice-num= " + answerSel + "]")[0]).css('opacity',1.0);
$(".drag-choice-wordbank[choice-num= " + answerSel + "]").appendTo($("#choices > .drop-choice-list:eq(" + answerSel + ")"));
} else {

$(".drag-choice-wordbank[choice-num= " + beforeAnswerSel + "]").parent()
.find('.wordbank-key')
.css('display', 'inline-block');
}

$(".drag-choice-wordbank[choice-num= " + beforeAnswerSel + "]").css('opacity', 1.0);
$(".drag-choice-wordbank[choice-num= " + beforeAnswerSel + "]").appendTo($(this));
$("#choices > .drop-choice-list:eq(" + beforeAnswerSel + ")").css('display','none');
$(this)
.find('.wordbank-key')
.css('display', 'none');
setInitializeClick();
return false;
} else {
if (answerSel === undefined){

if (dropSel){
$('.wordbank-key').css('border', '2px solid #ccc');
dropSel = false;
} else {
dropSel = $(this).attr('answer-num');
beforePosition = $(this).children();

$('.wordbank-key').css('border', '2px solid #ccc');
$(this).children().css('border','2px solid red')
}
}
}
})
});
} else {
dragObject.each(function (index) {
$(this).attr('choice-num',index);
$(this).on('click', function(){
choiceSel = $(this).attr('choice-num');
if (beforeAnswerSel == choiceSel) {

$(this).fadeTo(100, 1, function(){
beforeAnswerSel = -1;
});
} else if (beforeAnswerSel == -1) {

$(this).fadeTo(100, 0.5, function(){
beforeAnswerSel = choiceSel;
beforePosition = $(this).parent();
});
} else if (beforeAnswerSel > -1){

if (beforeAnswerSel != choiceSel){
$(".drag-choice[choice-num= " + beforeAnswerSel + "]").appendTo($(this).parent());
$(".drag-choice[choice-num= " + choiceSel + "]").appendTo(beforePosition);
$(".drag-choice[choice-num= " + beforeAnswerSel + "]").css('opacity',1);
beforeAnswerSel = -1;
}
}
})
})
}
}





function setInitializeClick(){
beforeAnswerSel = -1;
choiceSel = -1;
dropSel = false;
dropArea = false;
answerSel = false;
beforePosition = false;
$('.drag-choice-wordbank').css('opacity',1.0);
$('.drag-choice').css('opacity',1.0);
$('.wordbank-key').css('border', '2px solid #ccc');
}





function settingSectionReturnRule() {
let returnableSectionIndex = 0;
_cfg.settings.section_return_rule_array.forEach(function (_rule, si) {
movableMinSections[si] = returnableSectionIndex;

if (_rule === 'no_return') {
isActiveSectionReturnRule = true
returnableSectionIndex = si + 1;
}
});
}








function movableBySectionReturnRule(from, to) {
if (finished || !isActiveSectionReturnRule) {
return true;
}

if (from <= to) return true;

const fromSection = _cfg.questions[from].section;
const toSection = _cfg.questions[to].section;

if (fromSection <= toSection) return true;


return movableMinSections[fromSection] <= toSection;
}








function moveQuiz(from, to, moveCallback) {
if (processSectionReturnRule(from, to, moveCallback)) {


return;
}

moveCallback();
}









function processSectionReturnRule(from, to, moveCallback) {
if (finished || !isActiveSectionReturnRule) {
return false;
}


if (!movableBySectionReturnRule(from, to)) {
return true;
}


if (!movableBySectionReturnRule(to, from)) {

if (
_cfg.settings.show_instant_result &&
!_cfg.settings.allow_submission_without_answer &&
!hasSubmittedAnswers(getMovableMinSectionByPosition(to) - 1)) {
qalert('Unable to move sections because there are unanswered questions');
return true;
}
showSectionMoveConfirmationModal(moveCallback, getSectionsNotMovableOnTheMove(from, to));
return true;
}

return false
}







function showSectionMoveConfirmationModal(callback, sections) {

if (sections.length) {
let sectionListHtml = '';
sections.forEach(function (si) {
sectionListHtml += '<li>' + _cfg.settings.section_name_array[si] + ' > ' + (si + 1) + '</li>';
});
sectionListHtml = '<div class="well"><ul>' + sectionListHtml + '</ul></div>';
$('#move-section-confirmation-modal .section-list').empty();
$('#move-section-confirmation-modal .section-list').html(sectionListHtml);
}



const shouldShowMessage1 = !_cfg.settings.show_instant_result || _cfg.settings.allow_submission_without_answer;
$('#move-section-confirmation-modal .message1').toggle(shouldShowMessage1);


$('#move-section-confirmation-button').off('click');
$('#move-section-confirmation-button').on('click', function (e) {
$('#move-section-confirmation-modal').modal('hide');
callback();
});
$('#move-section-confirmation-modal').modal();
}







function getMovableMinSectionByPosition(position) {
return movableMinSections[_cfg.questions[position].section];
}







function hasSubmittedAnswers(section) {
for (i = 0; i < _cfg.settings.question_count; i++) {
if (
_cfg.questions[i].section <= section &&
(typeof _cfg.questions[i].result === 'undefined' || typeof _cfg.questions[i].result === 'null')
) {
return false;
}
}
return true;
}








function getSectionsNotMovableOnTheMove(from, to) {
if (from >= to) return [];

const sections = [];
for (let i = getMovableMinSectionByPosition(from); i < getMovableMinSectionByPosition(to); i++) {
sections.push(i);
}
return sections;
}


const SELECTORS_MOVE_BUTTON = [
'#suspend_button',
'#hide_list_button',
'#display_prev_quiz',
'#display_prev_explanation_page',
'#display_next_quiz',
'#display_next_explanation_page',
'#check_answer_button',
'#check_answer_next_button',
'#not_disp_answer_mark_button',
'#not_disp_answer_next_button',
'#show_result',
'#abort_quiz',
];





function togglePreventAllMove (prevent) {

if (pagination) {
prevent ? pagination.disableAllMoveButton() : pagination.updateDisable();
}

prevent
? $(SELECTORS_MOVE_BUTTON.join(',')).attr('disabled', true)
: $(SELECTORS_MOVE_BUTTON.join(',')).removeAttr('disabled');

preventKeydownEvent = prevent;
}


const QUESTION_TYPES_CAN_USE_SHORTCODE_IN_CHOICE = [
'sa',
'sa-box',
'ma',
'button',

'sort',

'wordbank',








];






function canUseShortcodeInChoice(type) {
return QUESTION_TYPES_CAN_USE_SHORTCODE_IN_CHOICE.indexOf(type) > -1;
}
