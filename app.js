/* eslint-disable no-unused-vars */
(function () {
  'use strict';

  var REQUIRED_COLS = ['動物ID', '生年月日'];
  var MAIN_METRICS = ['DWP$', 'NM$', 'TPI'];
  var MAX_ADDITIONAL = 5;

  /** 利用期限（YYYY-MM-DD）。null の場合は期限なし。例: '2027-12-31' とすると2027年12月31日まで有効。 */
  var EXPIRY_DATE = '2027-12-31';

  var traitDictionary = {
    '順位': { nameJa: '順位', desc: '総合指標による順位。同値の場合は同順位とする。', direction: 'neutral', tip: '選択した総合指標の良い順に1から付与します。', unit: '', synonyms: ['Rank', 'ランク'], formalName: 'Rank' },
    '動物ID': { nameJa: '動物ID', desc: '個体を識別するID', direction: 'neutral', tip: 'レポートで個体を特定するために使用します。', unit: '', synonyms: ['Animal ID', 'ID'], formalName: 'Animal ID' },
    'Official ID': { nameJa: '公式ID', desc: '公式登録ID', direction: 'neutral', tip: '', unit: '', synonyms: ['Official ID'] },
    '動物名': { nameJa: '動物名', desc: '個体の名前', direction: 'neutral', tip: '', unit: '', synonyms: ['Name'], formalName: 'Animal Name' },
    'Group': { nameJa: 'グループ', desc: 'グループ分類', direction: 'neutral', tip: '', unit: '', synonyms: ['Group'] },
    'Sex': { nameJa: '性別', desc: '性別', direction: 'neutral', tip: '', unit: '', synonyms: ['Sex'] },
    'Status': { nameJa: 'ステータス', desc: '個体ステータス', direction: 'neutral', tip: '', unit: '', synonyms: ['Status'] },
    '生年月日': { nameJa: '生年月日', desc: '出生日', direction: 'neutral', tip: 'フィルタ・散布図のX軸に使用します。', unit: '', synonyms: ['Birth', 'DOB'], formalName: 'Date of Birth' },
    'SIRE': { nameJa: 'SIRE', desc: '種牡牛名（父牛）', direction: 'neutral', tip: 'CSVの「レコード名の名前の～」列は自動でSIREに変換されます。', unit: '', synonyms: ['Sire', '種牡牛'], formalName: 'Sire' },
    'SIRECD': { nameJa: 'SIRECD', desc: '種牡牛のNAABコード', direction: 'neutral', tip: 'CSVの「レコード～NAAB」列は自動でSIRECDに変換され、表では生年月日の次に表示されます。', unit: '', synonyms: ['Sire CD', 'NAAB'], formalName: 'Sire NAAB Code' },
    '品種': { nameJa: '品種', desc: '品種名', direction: 'neutral', tip: '', unit: '', synonyms: ['Breed'], formalName: 'Breed' },
    'DWP$': { nameJa: 'DWP$', desc: '乳量・乳成分・耐久性等を総合した経済価値指標（ドル）', direction: 'higher', tip: '高いほど経済的に有利です。', unit: '$', synonyms: ['DWP'], formalName: 'Dairy Wellness Profit' },
    'TPI': { nameJa: 'TPI', desc: 'Total Performance Index。総合能力指数', direction: 'higher', tip: '高いほど総合的に優れています。', unit: '', synonyms: ['TPI'], formalName: 'Total Performance Index' },
    'NM$': { nameJa: 'NM$', desc: 'Net Merit。純利益指標（ドル）', direction: 'higher', tip: '高いほど収益性が高いと評価されます。', unit: '$', synonyms: ['NM'], formalName: 'Net Merit' },
    'CM$': { nameJa: 'CM$', desc: 'Cheese Merit。チーズ用乳価値', direction: 'higher', tip: '', unit: '$', synonyms: ['CM'], formalName: 'Cheese Merit' },
    'FM$': { nameJa: 'FM$', desc: 'Fluid Merit。飲用乳価値', direction: 'higher', tip: '', unit: '$', synonyms: ['FM'], formalName: 'Fluid Merit' },
    'GM$': { nameJa: 'GM$', desc: 'Grazing Merit。放牧適性の経済価値', direction: 'higher', tip: '', unit: '$', synonyms: ['GM'], formalName: 'Grazing Merit' },
    '乳量': { nameJa: '乳量', desc: '乳量の遺伝的能力', direction: 'higher', tip: '', unit: 'lb', synonyms: ['Milk'], formalName: 'Milk Yield' },
    'FAT': { nameJa: '乳脂率', desc: '乳脂率の遺伝的能力', direction: 'higher', tip: '', unit: '%', synonyms: ['Fat'], formalName: 'Fat' },
    'PROT': { nameJa: '乳蛋白率', desc: '乳蛋白率の遺伝的能力', direction: 'higher', tip: '', unit: '%', synonyms: ['Protein'], formalName: 'Protein' },
    'FS ': { nameJa: '体型総合', desc: '体型スコア総合（列名は末尾スペース付き）', direction: 'higher', tip: 'CSV列名は「FS 」です。', unit: '', synonyms: ['FS'], formalName: 'Final Score' },
    'RFI': { nameJa: 'RFI', desc: '残差飼料摂取量。低いほど飼料効率が良い', direction: 'lower', tip: '低いほど良い指標です。', unit: '', synonyms: ['RFI'], formalName: 'Residual Feed Intake' },
    'FE': { nameJa: 'FE', desc: '飼料効率', direction: 'higher', tip: '', unit: '', synonyms: ['FE'], formalName: 'Feed Efficiency' },
    'SCS': { nameJa: 'SCS', desc: '体細胞スコア。低いほど乳房炎リスクが低い', direction: 'lower', tip: '低いほど良い指標です。', unit: '', synonyms: ['SCS'], formalName: 'Somatic Cell Score' },
    'DPR': { nameJa: 'DPR', desc: '妊娠率', direction: 'higher', tip: '', unit: '%', synonyms: ['DPR'], formalName: 'Daughter Pregnancy Rate' },
    'HCR': { nameJa: 'HCR', desc: '処女牛（育成牛）の受胎率。高いほど受胎しやすい', direction: 'higher', tip: 'Heifer Conception Rate。高いほど繁殖成績が良いと評価されます。', unit: '%', synonyms: ['HCR'], formalName: 'Heifer Conception Rate' },
    'CCR': { nameJa: 'CCR', desc: '成牛の受胎率。高いほど受胎しやすい', direction: 'higher', tip: 'Cow Conception Rate。泌乳牛の受胎のしやすさの遺伝的能力です。', unit: '%', synonyms: ['CCR'], formalName: 'Cow Conception Rate' },
    'FI': { nameJa: 'FI', desc: 'FIはデータソースにより意味が異なります。Fertility Index（繁殖指数）の場合は受胎・妊娠に関する総合的な繁殖能力。Calving Ease（分娩容易性）の場合は分娩のしやすさ。', direction: 'higher', tip: '高いほど良いとされることが多いです。データ提供元の説明を確認してください。', unit: '', synonyms: ['FI'], formalName: 'Fertility Index / Calving Ease (FI)' },
    'PL': { nameJa: 'PL', desc: '持久力・生存', direction: 'higher', tip: '', unit: '', synonyms: ['PL'], formalName: 'Productive Life' },
    'LIV': { nameJa: 'LIV', desc: '生存率', direction: 'higher', tip: '', unit: '', synonyms: ['LIV'], formalName: 'Livability' },
    'SCE': { nameJa: 'SCE', desc: '種雄牛の分娩容易性。低いほど難産が少ない', direction: 'lower', tip: 'Sire Calving Ease。低いほど良い指標です。', unit: '', synonyms: ['SCE'], formalName: 'Sire Calving Ease' },
    'DCE': { nameJa: 'DCE', desc: '娘牛の分娩容易性。低いほど難産が少ない', direction: 'lower', tip: 'Daughter Calving Ease。低いほど良い指標です。', unit: '', synonyms: ['DCE'], formalName: 'Daughter Calving Ease' },
    'SSB': { nameJa: 'SSB', desc: 'Stillbirth 単胎。低いほど良い', direction: 'lower', tip: '低いほど良い指標です。', unit: '', synonyms: ['SSB'], formalName: 'Stillbirth (Single)' },
    'DSB': { nameJa: 'DSB', desc: 'Stillbirth 双胎。低いほど良い', direction: 'lower', tip: '低いほど良い指標です。', unit: '', synonyms: ['DSB'], formalName: 'Stillbirth (Twin)' },
    'CA$': { nameJa: 'CA$', desc: '分娩能力指数。分娩容易性と死産率を組み合わせた経済価値', direction: 'higher', tip: 'Calving Ability。SCE・DCE・SSB・DSBを統合した指標で、高いほど難産・死産が少ないと評価されます。', unit: '$', synonyms: ['CA'], formalName: 'Calving Ability' },
    'GL': { nameJa: 'GL', desc: '妊娠期間（日数）。種雄牛の遺伝的効果', direction: 'neutral', tip: 'Gestation Length。標準では色分けしません。データソースにより泌乳持続性を指す場合もあります。', unit: '日', synonyms: ['GL'], formalName: 'Gestation Length' },
    'EFC': { nameJa: 'EFC', desc: '初産年齢の若さ。若い初産を遺伝的に持つほどプラス', direction: 'higher', tip: 'Early First Calving。プラスほど娘牛の初産が早くなり、育成コスト削減に寄与します。', unit: '日', synonyms: ['EFC'], formalName: 'Early First Calving' },
    'TYPE FS': { nameJa: '体型FS', desc: '体型総合', direction: 'higher', tip: '', unit: '', synonyms: ['TYPE FS'], formalName: 'Type Final Score' },
    'UDC': { nameJa: 'UDC', desc: '乳房の深さ・付着', direction: 'higher', tip: '', unit: '', synonyms: ['UDC'], formalName: 'Udder Composite' },
    'BDC': { nameJa: 'BDC', desc: '体深。中庸', direction: 'neutral', tip: '標準では色分けしません。', unit: '', synonyms: ['BDC'], formalName: 'Body Depth Composite' },
    'FLC': { nameJa: 'FLC', desc: '肢蹄総合', direction: 'higher', tip: '', unit: '', synonyms: ['FLC'], formalName: 'Foot and Leg Composite' },
    'BVDV Results': { nameJa: 'BVDV結果', desc: 'BVDV検査結果（文字列）', direction: 'neutral', tip: '色分け・Z・グラフ対象外です。', unit: '', synonyms: ['BVDV'], formalName: 'Bovine Viral Diarrhea Virus Results' },
    'MSPD': { nameJa: 'MSPD', desc: '多胎率', direction: 'higher', tip: '', unit: '', synonyms: ['MSPD'], formalName: 'Multiple Birth Rate' },
    'MSPD Reliability': { nameJa: 'MSPD信頼性', desc: 'MSPDの信頼性', direction: 'neutral', tip: '', unit: '', synonyms: [] }
  };

  var LOWER_IS_BETTER = ['RFI', 'SCS', 'SCE', 'DCE', 'SSB', 'DSB'];
  function getDirection(col) {
    var t = traitDictionary[col];
    if (t && t.direction === 'lower') return 'lower';
    if (t && t.direction === 'neutral') return 'neutral';
    return 'higher';
  }

  function isNumericCol(header, value) {
    if (!header) return false;
    var v = String(value).trim();
    if (v === '' || v === 'NA') return true;
    return !isNaN(parseFloat(v)) && isFinite(v);
  }

  /** 利用期限を過ぎている場合は true */
  function isExpired() {
    if (!EXPIRY_DATE || typeof EXPIRY_DATE !== 'string') return false;
    var expiry = new Date(EXPIRY_DATE);
    if (isNaN(expiry.getTime())) return false;
    expiry.setHours(23, 59, 59, 999);
    return new Date() > expiry;
  }

  /** 期限切れ時はオーバーレイを表示し、操作を無効化する */
  function applyExpiry() {
    if (!isExpired()) return;
    var overlay = document.createElement('div');
    overlay.id = 'expiryOverlay';
    overlay.setAttribute('role', 'alert');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);color:#fff;display:flex;align-items:center;justify-content:center;z-index:9999;font-family:sans-serif;text-align:center;padding:2rem;box-sizing:border-box;';
    overlay.innerHTML = '<div style="max-width:400px;"><p style="font-size:1.25rem;margin:0 0 1rem;font-weight:bold;">利用期限のお知らせ</p><p style="margin:0 0 1rem;line-height:1.6;">このアプリの利用期限が切れています。<br>引き続きご利用の場合は、配布元までお問い合わせください。</p><p style="font-size:0.9rem;opacity:0.9;">有効期限: ' + (EXPIRY_DATE || '—') + '</p></div>';
    document.body.appendChild(overlay);
    var appLayout = document.querySelector('.app-layout');
    if (appLayout) appLayout.style.pointerEvents = 'none';
  }

  var rawRows = [];
  var csvHeaders = [];
  var filteredRows = [];
  var numericColumns = [];
  var selectedAdditional = [];
  var chartInstances = [];
  var chartInstancesByContainer = { scatterDateCard: [], scatterYearCard: [] };
  /** 散布図でホバー中の個体ID。全散布図で同一IDをハイライトするために使用 */
  var scatterHoveredId = null;
  /** レポート表示中の行（ID検索で参照） */
  var reportRows = [];

  /** ローカル保存（ユーザー指定JSONへ保存する） */
  var FS_SUPPORTED = !!(window.showOpenFilePicker && window.showSaveFilePicker && window.indexedDB);
  var fileHandle = null;
  var saveTimer = null;
  var needPermission = false;
  var startMode = null; // 'new' | 'saved'
  var IDB_DB_NAME = 'dairynotebookgm-fs-storage-v1';
  var IDB_STORE_NAME = 'kv';

  function idbOpen() {
    return new Promise(function (res, rej) {
      try {
        var r = indexedDB.open(IDB_DB_NAME, 1);
        r.onupgradeneeded = function (e) {
          var db = e.target.result;
          if (db && !db.objectStoreNames.contains(IDB_STORE_NAME)) db.createObjectStore(IDB_STORE_NAME);
        };
        r.onsuccess = function (e) { res(e.target.result); };
        r.onerror = function () { rej(r.error); };
      } catch (err) { rej(err); }
    });
  }

  function idbGet(key) {
    return idbOpen().then(function (db) {
      return new Promise(function (res, rej) {
        var tx = db.transaction(IDB_STORE_NAME, 'readonly');
        var store = tx.objectStore(IDB_STORE_NAME);
        var req = store.get(key);
        req.onsuccess = function () { res(req.result); };
        req.onerror = function () { rej(req.error); };
      });
    }).catch(function () { return undefined; });
  }

  function idbSet(key, val) {
    return idbOpen().then(function (db) {
      return new Promise(function (res, rej) {
        var tx = db.transaction(IDB_STORE_NAME, 'readwrite');
        var store = tx.objectStore(IDB_STORE_NAME);
        store.put(val, key);
        tx.oncomplete = function () { res(); };
        tx.onerror = function () { rej(tx.error); };
      });
    }).catch(function () {});
  }

  function setLocalDataFileInfo(text) {
    if (el && el.localDataFileInfo) el.localDataFileInfo.textContent = text || 'ファイル未接続';
    // 単回レポートのため、保存ボタンは常に有効にして「ファイル未選択なら新規作成」へフォールバックする
    if (el && el.btnSaveDataFile) el.btnSaveDataFile.disabled = false;
  }

  function scheduleFileSave() {
    // 単回レポート前提のため、自動保存は行わない。
    // 手動保存（今すぐ保存 / 保存先の作成）はユーザー操作で実行する。
    return;
  }

  function dataToJSON() {
    return JSON.stringify({
      version: 1,
      savedAt: new Date().toISOString(),
      state: {
        page: (el && el.sectionReport && !el.sectionReport.hidden) ? 'report' : 'input',
        farmName: (el && el.farmName) ? (el.farmName.value || '') : '',
        dateFrom: (el && el.dateFrom) ? (el.dateFrom.value || '') : '',
        dateTo: (el && el.dateTo) ? (el.dateTo.value || '') : '',
        mainMetric: (el && el.mainMetric) ? (el.mainMetric.value || '') : '',
        showYearAvg: (el && el.showYearAvg) ? !!el.showYearAvg.checked : false,
        showTrendLine: (el && el.showTrendLine) ? !!el.showTrendLine.checked : false,
        selectedAdditional: selectedAdditional || [],
        benchmarks: collectBenchmarks ? collectBenchmarks() : {},
        rawRows: rawRows || [],
        csvHeaders: csvHeaders || []
      }
    }, null, 2);
  }

  function applyDataJSON(d) {
    if (!d || typeof d !== 'object') throw new Error('データ形式が不正です');
    var st = d.state || d;
    if (!st || !Array.isArray(st.rawRows) || !Array.isArray(st.csvHeaders)) throw new Error('データが欠損しています');

    // 現在のグラフを破棄（復元で重複を避ける）
    chartInstances.forEach(function (c) { try { c.destroy(); } catch (e) {} });
    chartInstances = [];

    rawRows = st.rawRows;
    csvHeaders = st.csvHeaders;
    selectedAdditional = Array.isArray(st.selectedAdditional) ? st.selectedAdditional : [];
    numericColumns = buildNumericColumns(csvHeaders, rawRows[0] || {});

    if (el && el.farmName) el.farmName.value = st.farmName || '';
    if (el && el.dateFrom) el.dateFrom.value = st.dateFrom || '';
    if (el && el.dateTo) el.dateTo.value = st.dateTo || '';
    if (el && el.mainMetric) el.mainMetric.value = st.mainMetric || '';
    if (el && el.showYearAvg) el.showYearAvg.checked = !!st.showYearAvg;
    if (el && el.showTrendLine) el.showTrendLine.checked = !!st.showTrendLine;

    // 入力UI再構築
    if (el && el.metricSearch) el.metricSearch.value = '';
    if (el && el.sectionReport) el.sectionReport.hidden = true;
    if (el && el.sectionInput) el.sectionInput.hidden = false;
    if (el && el.btnBackEdit) el.btnBackEdit.style.display = 'none';

    renderChips();
    refillMetricDropdown();
    updateBenchmarkInputs();

    // ベンチマーク値の復元
    var benches = st.benchmarks && typeof st.benchmarks === 'object' ? st.benchmarks : {};
    if (el && el.benchmarkInputs) {
      var inputs = el.benchmarkInputs.querySelectorAll('input[data-metric]');
      inputs.forEach(function (inp) {
        var m = inp.getAttribute('data-metric');
        if (m && benches[m] != null) inp.value = benches[m];
      });
    }

    // 画面状態の復元
    if (st.page === 'report') {
      runReport();
    }
  }

  function readFromHandle(handle) {
    return handle.getFile().then(function (file) {
      return file.text().then(function (text) {
        var parsed = JSON.parse(text || '{}');
        applyDataJSON(parsed);
        return file;
      });
    });
  }

  async function writeToFile() {
    if (!FS_SUPPORTED) return;
    if (!fileHandle) return;
    setLocalDataFileInfo('保存中...');
    if (needPermission) {
      try {
        var perm = await fileHandle.requestPermission({ mode: 'readwrite' });
        if (perm !== 'granted') throw new Error('保存先への権限がありません');
        needPermission = false;
      } catch (e) {
        setLocalDataFileInfo('アクセス許可が必要です（保存を再度お試しください）');
        return;
      }
    }
    setLoading(true, 'ローカル保存中...');
    try {
      var w = await fileHandle.createWritable();
      await w.write(dataToJSON());
      await w.close();
      setLocalDataFileInfo('保存しました');
    } catch (err) {
      setLocalDataFileInfo('保存に失敗しました');
    } finally {
      setLoading(false);
    }
  }

  async function openLocalDataFile() {
    if (!FS_SUPPORTED) { setLocalDataFileInfo('File System Access API 未対応のため利用不可'); return; }
    try {
      var handles = await window.showOpenFilePicker({
        types: [{ description: 'DairyNotebookGM データ', accept: { 'application/json': ['.json'] } }],
        multiple: false
      });
      if (!handles || !handles.length) return;
      fileHandle = handles[0];
      needPermission = false;
      var file = await readFromHandle(fileHandle);
      setLocalDataFileInfo('読み込み完了: ' + (file && file.name ? file.name : ''));
    } catch (e) {
      if (e && e.name !== 'AbortError') setLocalDataFileInfo('読み込みに失敗しました');
    }
  }

  async function createLocalDataFile() {
    if (!FS_SUPPORTED) { setLocalDataFileInfo('File System Access API 未対応のため利用不可'); return; }
    try {
      fileHandle = await window.showSaveFilePicker({
        suggestedName: getLocalDataFilename(),
        types: [{ description: 'DairyNotebookGM データ', accept: { 'application/json': ['.json'] } }]
      });
      needPermission = false;
      // 既に画面にデータがある前提で、その内容を即保存
      await writeToFile();
    } catch (e) {
      if (e && e.name !== 'AbortError') setLocalDataFileInfo('新規作成に失敗しました');
    }
  }

  async function tryRestoreFileHandle() {
    if (!FS_SUPPORTED) return;
    try {
      var h = await idbGet('fileHandle');
      if (!h) return;
      fileHandle = h;
      // アクセス許可の状態を確認（ブラウザ差あり）
      try {
        var perm = await fileHandle.queryPermission({ mode: 'readwrite' });
        if (perm === 'granted') {
          needPermission = false;
          var file = await readFromHandle(fileHandle);
          setLocalDataFileInfo('自動復元: ' + (file && file.name ? file.name : ''));
        } else {
          needPermission = true;
          setLocalDataFileInfo('保存先ファイルにアクセス許可が必要です');
        }
      } catch (e2) {
        // queryPermission が無いブラウザ向け: 明示的な保存操作で許可を取り直す
        needPermission = true;
        setLocalDataFileInfo('保存先へのアクセス許可が必要です');
      }
    } catch (e) {
      fileHandle = null;
      needPermission = false;
    }
  }

  // ── ウィザード UI ヘルパー ──────────────────────────────────────────

  /** 初期選択エリアを隠して選択後ステータスエリアを表示する */
  function showLocalSaveStatus() {
    if (el && el.localSaveInitialChoice) el.localSaveInitialChoice.hidden = true;
    if (el && el.localSaveStatus) el.localSaveStatus.hidden = false;
  }

  /** 基本情報・CSV・指標設定エリアを表示する */
  function showMainInputSections() {
    if (el && el.mainInputSections) el.mainInputSections.hidden = false;
  }

  /** 新規作成モード開始：フォームを表示しCSVアップロードも見せる */
  function startNewMode() {
    startMode = 'new';
    showLocalSaveStatus();
    showMainInputSections();
    if (el && el.csvUploadSection) el.csvUploadSection.hidden = false;
    setLocalDataFileInfo('新規作成モード（保存先は「今すぐ保存」時に選択）');
  }

  /** 保存済みモード開始：JSONを開いてフォームを復元し、CSVアップロードを隠す */
  async function startSavedMode() {
    if (!FS_SUPPORTED) { showError('File System Access API 未対応のため利用不可'); return; }
    try {
      var handles = await window.showOpenFilePicker({
        types: [{ description: 'DairyNotebookGM データ', accept: { 'application/json': ['.json'] } }],
        multiple: false
      });
      if (!handles || !handles.length) return;
      fileHandle = handles[0];
      needPermission = false;
      var file = await readFromHandle(fileHandle);
      startMode = 'saved';
      showLocalSaveStatus();
      showMainInputSections();
      if (el && el.csvUploadSection) el.csvUploadSection.hidden = true;
      setLocalDataFileInfo('読み込み完了: ' + (file && file.name ? file.name : ''));
    } catch (e) {
      if (e && e.name !== 'AbortError') showError('ファイルの読み込みに失敗しました');
    }
  }

  /** 作業方法変更：初期選択に戻りフォームを隠す */
  function resetToInitialChoice() {
    startMode = null;
    fileHandle = null;
    needPermission = false;
    if (el && el.localSaveInitialChoice) el.localSaveInitialChoice.hidden = false;
    if (el && el.localSaveStatus) el.localSaveStatus.hidden = true;
    if (el && el.mainInputSections) el.mainInputSections.hidden = true;
    if (el && el.localDataFileInfo) el.localDataFileInfo.textContent = 'ファイル未接続';
    if (el && el.btnSaveDataFile) el.btnSaveDataFile.disabled = true;
    reset();
  }

  // ── 上書き／別名保存 モーダル ──────────────────────────────────────

  function openSaveOptionsModal() {
    if (el && el.saveOptionsModal) {
      el.saveOptionsModal.hidden = false;
      el.saveOptionsModal.style.display = '';
    }
  }

  function closeSaveOptionsModal() {
    if (el && el.saveOptionsModal) {
      el.saveOptionsModal.hidden = true;
      el.saveOptionsModal.style.display = 'none';
    }
  }

  /** 別ファイルに保存（新しいfileHandleを取得して保存） */
  async function saveAsNewFile() {
    closeSaveOptionsModal();
    if (!FS_SUPPORTED) return;
    try {
      fileHandle = await window.showSaveFilePicker({
        suggestedName: getLocalDataFilename(),
        types: [{ description: 'DairyNotebookGM データ', accept: { 'application/json': ['.json'] } }]
      });
      needPermission = false;
      await writeToFile();
    } catch (e) {
      if (e && e.name !== 'AbortError') showError('別名保存に失敗しました');
    }
  }

  // ─────────────────────────────────────────────────────────────────────

  var el = {
    farmName: document.getElementById('farmName'),
    dateFrom: document.getElementById('dateFrom'),
    dateTo: document.getElementById('dateTo'),
    csvFile: document.getElementById('csvFile'),
    csvDropZone: document.getElementById('csvDropZone'),
    btnSelectCsv: document.getElementById('btnSelectCsv'),
    csvFileName: document.getElementById('csvFileName'),
    localDataFileInfo: document.getElementById('localDataFileInfo'),
    btnOpenDataFile: document.getElementById('btnOpenDataFile'),
    btnCreateDataFile: document.getElementById('btnCreateDataFile'),
    btnSaveDataFile: document.getElementById('btnSaveDataFile'),
    mainMetric: document.getElementById('mainMetric'),
    metricSearch: document.getElementById('metricSearch'),
    additionalMetricSelect: document.getElementById('additionalMetricSelect'),
    selectedChips: document.getElementById('selectedChips'),
    showYearAvg: document.getElementById('showYearAvg'),
    showTrendLine: document.getElementById('showTrendLine'),
    benchmarkInputs: document.getElementById('benchmarkInputs'),
    btnGenerate: document.getElementById('btnGenerate'),
    btnReset: document.getElementById('btnReset'),
    btnBackEdit: document.getElementById('btnBackEdit'),
    btnBackEdit2: document.getElementById('btnBackEdit2'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    loadingText: document.getElementById('loadingText'),
    sectionInput: document.getElementById('sectionInput'),
    sectionReport: document.getElementById('sectionReport'),
    dashboardCard: document.getElementById('dashboardCard'),
    tableLegendCard: document.getElementById('tableLegendCard'),
    table1Card: document.getElementById('table1Card'),
    table2Card: document.getElementById('table2Card'),
    scatterSearchCard: document.getElementById('scatterSearchCard'),
    scatterIdSearch: document.getElementById('scatterIdSearch'),
    btnScatterIdSearch: document.getElementById('btnScatterIdSearch'),
    btnScatterIdClear: document.getElementById('btnScatterIdClear'),
    scatterSearchMessage: document.getElementById('scatterSearchMessage'),
    scatterDateCard: document.getElementById('scatterDateCard'),
    scatterYearCard: document.getElementById('scatterYearCard'),
    btnSavePdf: document.getElementById('btnSavePdf'),
    btnPrintTables: document.getElementById('btnPrintTables'),
    btnPrintGraphs: document.getElementById('btnPrintGraphs'),
    termPanel: document.getElementById('termPanel'),
    closeTermPanel: document.getElementById('closeTermPanel'),
    termSearch: document.getElementById('termSearch'),
    termPanelContent: document.getElementById('termPanelContent'),
    detailModal: document.getElementById('detailModal'),
    closeDetailModal: document.getElementById('closeDetailModal'),
    detailModalBody: document.getElementById('detailModalBody'),
    errorToast: document.getElementById('errorToast'),
    btnHelp: document.getElementById('btnHelp'),
    btnTermGlossary: document.getElementById('btnTermGlossary'),
    selectedCount: document.getElementById('selectedCount'),
    navTabInput: document.getElementById('navTabInput'),
    navTabReport: document.getElementById('navTabReport'),
    btnAllTerms: document.getElementById('btnAllTerms'),
    guideModal: document.getElementById('guideModal'),
    closeGuideModal: document.getElementById('closeGuideModal'),
    btnGuideOk: document.getElementById('btnGuideOk'),
    // ウィザード UI
    mainInputSections: document.getElementById('mainInputSections'),
    csvUploadSection: document.getElementById('csvUploadSection'),
    localSaveInitialChoice: document.getElementById('localSaveInitialChoice'),
    localSaveStatus: document.getElementById('localSaveStatus'),
    btnChangeSaveMode: document.getElementById('btnChangeSaveMode'),
    // 上書き／別名保存モーダル
    saveOptionsModal: document.getElementById('saveOptionsModal'),
    closeSaveOptionsModal: document.getElementById('closeSaveOptionsModal'),
    btnOverwriteSave: document.getElementById('btnOverwriteSave'),
    btnSaveAsNew: document.getElementById('btnSaveAsNew'),
    btnCancelSaveOptions: document.getElementById('btnCancelSaveOptions')
  };

  function showError(msg) {
    el.errorToast.textContent = msg;
    el.errorToast.hidden = false;
    setTimeout(function () { el.errorToast.hidden = true; }, 6000);
  }

  function setLoading(show, text) {
    var overlay = el.loadingOverlay;
    if (!overlay) return;
    overlay.hidden = !show;
    overlay.style.display = show ? '' : 'none';
    if (el.loadingText) el.loadingText.textContent = text || '処理中...';
    el.btnGenerate.disabled = show;
  }

  function parseDate(s) {
    if (s == null) return null;
    if (typeof s === 'number' && !isNaN(s)) {
      if (s > 1000 && s < 1000000) {
        var d = new Date((s - 25569) * 86400 * 1000);
        if (!isNaN(d.getTime())) return d;
      }
      return null;
    }
    var str = String(s).trim().replace(/^\uFEFF/, '');
    if (!str) return null;
    str = str.split(/\s/)[0] || str;
    var parts = str.split(/[/\-.]/);
    if (parts.length >= 3) {
      var y = parseInt(parts[0], 10);
      var mo = parseInt(parts[1], 10);
      var day = parseInt(parts[2], 10);
      if (!isNaN(y) && !isNaN(mo) && !isNaN(day) && y >= 1900 && y <= 2100 && mo >= 1 && mo <= 12 && day >= 1 && day <= 31) {
        var d = new Date(y, mo - 1, day);
        if (!isNaN(d.getTime())) return d;
      }
    }
    var d = new Date(str);
    if (!isNaN(d.getTime())) return d;
    if (/^\d{8}$/.test(str)) {
      d = new Date(parseInt(str.slice(0, 4), 10), parseInt(str.slice(4, 6), 10) - 1, parseInt(str.slice(6, 8), 10));
      if (!isNaN(d.getTime())) return d;
    }
    return null;
  }

  function parseNum(v) {
    if (v === '' || v == null) return NaN;
    var n = parseFloat(String(v).replace(/,/g, ''));
    return isNaN(n) ? NaN : n;
  }

  function getCsvHeaders(parsed) {
    if (!parsed.meta || !parsed.meta.fields) return parsed.data && parsed.data[0] ? Object.keys(parsed.data[0]) : [];
    return parsed.meta.fields;
  }

  /** CSV列名を標準名に変換（レコード名の名前の～→SIRE、レコード～NAAB→SIRECD） */
  function normalizeCsvHeader(h) {
    if (!h || typeof h !== 'string') return h;
    var s = h.trim();
    if (s.indexOf('レコード名の名前の') === 0) return 'SIRE';
    if (s.indexOf('レコード') === 0 && s.indexOf('NAAB') !== -1) return 'SIRECD';
    return h;
  }

  /** ヘッダー配列を正規化し、行データのキーも正規化した名前に差し替えた新配列を返す */
  function applyHeaderNormalization(headers, rows) {
    var normalized = headers.map(function (h) { return normalizeCsvHeader(h); });
    var normalizedRows = rows.map(function (row) {
      var r = {};
      for (var i = 0; i < headers.length; i++) r[normalized[i]] = row[headers[i]];
      return r;
    });
    var seen = {};
    var uniqueHeaders = [];
    for (var j = 0; j < normalized.length; j++) {
      var n = normalized[j];
      if (!seen[n]) { seen[n] = true; uniqueHeaders.push(n); }
    }
    return { headers: uniqueHeaders, rows: normalizedRows };
  }

  function validateRequiredColumns(headers) {
    return REQUIRED_COLS.filter(function (c) { return headers.indexOf(c) === -1; });
  }

  function buildNumericColumns(headers, firstRow) {
    var numCols = [];
    headers.forEach(function (h) {
      if (!h || h.trim() === '') return;
      if (h === 'BVDV Results' || h === '動物ID' || h === 'Official ID' || h === '動物名' || h === 'Group' || h === 'Sex' || h === 'Status' || h === '品種' || h === 'SIRE' || h === 'SIRECD') return;
      var val = firstRow[h];
      var n = parseNum(val);
      if (!isNaN(n) || isNumericCol(h, val)) numCols.push(h);
      else numCols.push(h);
    });
    return numCols;
  }

  function loadCsv(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var text = e.target.result;
        var parsed = window.Papa && window.Papa.parse(text, { header: true, skipEmptyLines: true });
        if (!parsed) { reject(new Error('CSVの解析に失敗しました。')); return; }
        var headers = getCsvHeaders(parsed);
        var normalized = applyHeaderNormalization(headers, parsed.data || []);
        headers = normalized.headers;
        var rows = normalized.rows;
        var missing = validateRequiredColumns(headers);
        if (missing.length > 0) {
          reject(new Error('不足している列名: ' + missing.join(', ')));
          return;
        }
        if (rows.length === 0) { reject(new Error('有効なデータ行がありません。')); return; }
        var dateParseFailCount = 0;
        var withDate = [];
        rows.forEach(function (row) {
          var d = parseDate(row['生年月日']);
          if (!d) dateParseFailCount++;
          else withDate.push(row);
        });
        if (withDate.length === 0) {
          reject(new Error('生年月日を解釈できた行が1件もありません。'));
          return;
        }
        rawRows = withDate;
        csvHeaders = headers;
        numericColumns = buildNumericColumns(headers, withDate[0]);
        resolve({ headers: headers, rows: withDate, numericColumns: numericColumns, dateFailCount: dateParseFailCount });
      };
      reader.onerror = function () { reject(new Error('ファイルの読み込みに失敗しました。')); };
      reader.readAsText(file, 'UTF-8');
    });
  }

  function applyDateFilter(rows, dateFrom, dateTo) {
    if (!dateFrom && !dateTo) return rows;
    return rows.filter(function (row) {
      var d = parseDate(row['生年月日']);
      if (!d) return false;
      if (dateFrom && d < new Date(dateFrom)) return false;
      if (dateTo) {
        var to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (d > to) return false;
      }
      return true;
    });
  }

  function getMetricColumns() {
    var main = el.mainMetric.value;
    var list = MAIN_METRICS.slice();
    selectedAdditional.forEach(function (c) { if (list.indexOf(c) === -1) list.push(c); });
    if (main && list.indexOf(main) === -1) list.unshift(main);
    return list;
  }

  function getDisplayMetrics() {
    var list = MAIN_METRICS.slice();
    selectedAdditional.forEach(function (c) { if (list.indexOf(c) === -1) list.push(c); });
    return list;
  }

  function computeStats(values) {
    var arr = values.filter(function (v) { return !isNaN(v); }).map(Number);
    if (arr.length === 0) return { mean: NaN, sd: NaN, p25: NaN, p75: NaN };
    var n = arr.length;
    var sum = arr.reduce(function (a, b) { return a + b; }, 0);
    var mean = sum / n;
    var variance = arr.reduce(function (acc, x) { return acc + (x - mean) * (x - mean); }, 0) / n;
    var sd = Math.sqrt(variance) || 0;
    var sorted = arr.slice().sort(function (a, b) { return a - b; });
    var p25 = sorted[Math.floor((n - 1) * 0.25)];
    var p75 = sorted[Math.floor((n - 1) * 0.75)];
    return { mean: mean, sd: sd, p25: p25, p75: p75 };
  }

  /** 線形回帰 y = a*x + b と決定係数 R² を返す */
  function linearRegression(points) {
    if (!points || points.length < 2) return null;
    var n = points.length;
    var sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (var i = 0; i < n; i++) {
      var x = points[i].x;
      var y = points[i].y;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }
    var denom = n * sumX2 - sumX * sumX;
    if (denom === 0) return null;
    var a = (n * sumXY - sumX * sumY) / denom;
    var b = (sumY - a * sumX) / n;
    var meanY = sumY / n;
    var ssTot = 0, ssRes = 0;
    for (var j = 0; j < n; j++) {
      var yj = points[j].y;
      var pred = a * points[j].x + b;
      ssTot += (yj - meanY) * (yj - meanY);
      ssRes += (yj - pred) * (yj - pred);
    }
    var r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;
    return { a: a, b: b, r2: r2 };
  }

  function getPercentileClass(val, p25, p75, direction) {
    if (isNaN(val) || direction === 'neutral') return '';
    if (direction === 'lower') {
      if (val <= p25) return 'pct-good';
      if (val >= p75) return 'pct-warn';
    } else {
      if (val >= p75) return 'pct-good';
      if (val <= p25) return 'pct-warn';
    }
    return '';
  }

  function formatDateStr(d) {
    if (!d || !d.getFullYear) return '';
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var day = d.getDate();
    return y + '/' + (m < 10 ? '0' + m : m) + '/' + (day < 10 ? '0' + day : day);
  }

  function buildReportHeader(farmName, dateFrom, dateTo, rows) {
    var outDate = new Date();
    var periodText = '—';
    var dates = rows.map(function (r) { return parseDate(getBirthDateFromRow(r)); }).filter(Boolean);
    if (dates.length > 0) {
      var minT = Math.min.apply(null, dates.map(function (d) { return d.getTime(); }));
      var maxT = Math.max.apply(null, dates.map(function (d) { return d.getTime(); }));
      periodText = formatDateStr(new Date(minT)) + ' ～ ' + formatDateStr(new Date(maxT));
    }
    return '<div class="report-header-inner">' +
      '<dl class="report-header-dl">' +
      '<dt>農場名</dt><dd class="report-farm-name">' + escapeHtml(farmName || '') + '</dd>' +
      '<dt>出力年月日</dt><dd>' + (outDate.getFullYear() + '年' + (outDate.getMonth() + 1) + '月' + outDate.getDate() + '日') + '</dd>' +
      '<dt>生年月日対象期間</dt><dd>' + escapeHtml(periodText) + '</dd>' +
      '</dl>' +
      '<div class="report-branding"><span class="report-brand-name">DairyNotebookGM</span></div>' +
      '</div>';
  }

  function buildDashboard(data) {
    var metrics = getDisplayMetrics();
    var html = '<h3>牛群ダッシュボード</h3><div class="dashboard-grid">';
    metrics.forEach(function (col) {
      var dir = getDirection(col);
      var vals = data.rows.map(function (r) { return parseNum(r[col]); }).filter(function (v) { return !isNaN(v); });
      if (vals.length === 0) {
        html += '<div class="dashboard-item"><span class="metric-name">' + escapeHtml(col) + '</span><div class="avg">データなし</div></div>';
        return;
      }
      var mean = vals.reduce(function (a, b) { return a + b; }, 0) / vals.length;
      var bestVal = dir === 'lower' ? Math.min.apply(null, vals) : Math.max.apply(null, vals);
      var worstVal = dir === 'lower' ? Math.max.apply(null, vals) : Math.min.apply(null, vals);
      var bestId = '';
      var worstId = '';
      data.rows.forEach(function (r) {
        var v = parseNum(r[col]);
        if (v === bestVal && !bestId) bestId = r['動物ID'] || '';
        if (v === worstVal && !worstId) worstId = r['動物ID'] || '';
      });
      html += '<div class="dashboard-item">';
      html += '<span class="metric-name">' + escapeHtml(col) + '</span>';
      html += '<div class="avg">平均: ' + formatNum(mean) + '</div>';
      html += '<div class="best">Best: ' + formatNum(bestVal) + ' (' + escapeHtml(bestId) + ')</div>';
      html += '<div class="worst">Worst: ' + formatNum(worstVal) + ' (' + escapeHtml(worstId) + ')</div>';
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  function escapeHtml(s) {
    if (s == null) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function formatNum(n) {
    if (n == null || isNaN(n)) return '—';
    var num = Number(n);
    return num.toLocaleString(undefined, { maximumFractionDigits: 4, minimumFractionDigits: 0 });
  }

  /** 表の色分けロジックをユーザー向けに説明する凡例HTML */
  function buildTableColorLegend() {
    return '<div class="table-legend-inner">' +
      '<h4 class="table-legend-title">表の色分けについて</h4>' +
      '<p class="table-legend-intro">各指標のセルは、<strong>この群れの中での相対的な位置</strong>で色分けしています（上位25％・下位25％・中間50％）。指標によって「高いほど良い」「低いほど良い」があり、ルールに応じて緑・黄が付きます。</p>' +
      '<ul class="table-legend-list" aria-label="色の意味">' +
      '<li><span class="table-legend-swatch table-legend-swatch-good" aria-hidden="true"></span><strong>緑</strong>：良い（上位25％）— その指標で群れの上位に入る値です。「高いほど良い」なら値が大きい、「低いほど良い」なら値が小さいときに付きます。</li>' +
      '<li><span class="table-legend-swatch table-legend-swatch-warn" aria-hidden="true"></span><strong>黄</strong>：要注目（下位25％）— その指標で群れの下位に入る値です。改善の検討がおすすめです。</li>' +
      '<li><span class="table-legend-swatch table-legend-swatch-none" aria-hidden="true"></span><strong>無色</strong>：中間50％、または「中庸」など色分けしない指標です。</li>' +
      '</ul></div>';
  }

  function buildTable(rows, metrics, tableTitle, rowsPerPage, rankValues) {
    var metaCols = ['動物ID', 'Official ID', '生年月日'];
    var displayCols = metaCols.filter(function (c) { return csvHeaders.indexOf(c) !== -1; });
    if (displayCols.indexOf('動物ID') === -1) displayCols.unshift('動物ID');
    if (displayCols.indexOf('生年月日') === -1) displayCols.push('生年月日');
    if (csvHeaders.indexOf('SIRECD') !== -1) {
      var dobIdx = displayCols.indexOf('生年月日');
      if (dobIdx !== -1 && displayCols.indexOf('SIRECD') === -1) displayCols.splice(dobIdx + 1, 0, 'SIRECD');
    }
    var hasRank = Array.isArray(rankValues) && rankValues.length === rows.length;
    var cols = hasRank ? ['順位'].concat(displayCols).concat(metrics) : displayCols.concat(metrics);

    var stats = {};
    metrics.forEach(function (col) {
      var vals = rows.map(function (r) { return parseNum(r[col]); });
      stats[col] = computeStats(vals);
    });

    var thead = '<thead>';
    if (tableTitle) {
      thead += '<tr><th colspan="' + cols.length + '" class="report-table-title">' + escapeHtml(tableTitle) + '</th></tr>';
    }
    thead += '<tr>';
    cols.forEach(function (c, i) {
      var stickyClass = i < 2 ? ' sticky-col' : '';
      if (c === '順位') {
        thead += '<th class="col-header' + stickyClass + '" data-col="順位" title="総合指標による順位">順位<span class="col-info" title="順位">ⓘ</span></th>';
        return;
      }
      var info = traitDictionary[c];
      var tip = info ? info.nameJa + ': ' + info.desc + '. ' + (info.direction === 'higher' ? '高いほど良い' : info.direction === 'lower' ? '低いほど良い' : '中庸') : '';
      thead += '<th class="col-header' + stickyClass + '" data-col="' + escapeHtml(c) + '" title="' + escapeHtml(tip) + '">' + escapeHtml(c) + '<span class="col-info" title="' + escapeHtml(tip) + '">ⓘ</span></th>';
    });
    thead += '</tr></thead>';

    function buildRow(row, rank) {
      var tr = '<tr>';
      cols.forEach(function (col, i) {
        var stickyClass = i < 2 ? ' sticky-col' : '';
        if (col === '順位') {
          tr += '<td class="' + stickyClass + '">' + (rank != null ? String(rank) : '—') + '</td>';
          return;
        }
        var cellClass = '';
        var val = row[col];
        if (metrics.indexOf(col) !== -1) {
          var numVal = parseNum(val);
          var st = stats[col];
          if (st && !isNaN(numVal)) cellClass = getPercentileClass(numVal, st.p25, st.p75, getDirection(col));
          val = formatNum(numVal);
        } else val = val != null && val !== '' ? escapeHtml(String(val)) : '—';
        if (col === '動物ID' || col === 'Official ID') {
          var rowId = getRowId(row);
          if (rowId !== '') {
            tr += '<td class="' + cellClass + stickyClass + '"><span class="scatter-id-link" data-row-id="' + escapeHtml(rowId) + '" role="button" tabindex="0" title="クリックで散布図でこのIDを強調">' + (typeof val === 'string' ? val : escapeHtml(String(val))) + '</span></td>';
          } else {
            tr += '<td class="' + cellClass + stickyClass + '">' + (typeof val === 'string' ? val : escapeHtml(String(val))) + '</td>';
          }
        } else {
          tr += '<td class="' + cellClass + stickyClass + '">' + (typeof val === 'string' ? val : escapeHtml(String(val))) + '</td>';
        }
      });
      return tr + '</tr>';
    }

    var tbody = '<tbody>';
    rows.forEach(function (row, idx) {
      var rank = hasRank ? rankValues[idx] : null;
      tbody += buildRow(row, rank);
    });
    tbody += '</tbody>';
    return '<div class="table-wrap"><table class="report-table">' + thead + tbody + '</table></div>';
  }

  function sortRows(rows, sortBy, direction) {
    var copy = rows.slice();
    copy.sort(function (a, b) {
      var va = parseNum(a[sortBy]);
      var vb = parseNum(b[sortBy]);
      if (isNaN(va) && isNaN(vb)) return 0;
      if (isNaN(va)) return 1;
      if (isNaN(vb)) return -1;
      return direction === 'lower' ? va - vb : vb - va;
    });
    return copy;
  }

  /** 指標でソート済みの行に対し、同順位を考慮した順位配列を返す（1位が最良） */
  function computeRanksByMetric(rows, metricCol, direction) {
    if (!rows.length) return [];
    var ranks = [];
    var r = 1;
    for (var i = 0; i < rows.length; i++) {
      if (i > 0) {
        var prev = parseNum(rows[i - 1][metricCol]);
        var curr = parseNum(rows[i][metricCol]);
        if (!isNaN(prev) && !isNaN(curr) && prev !== curr) r = i + 1;
        else if (isNaN(prev) || isNaN(curr)) r = i + 1;
      } else {
        r = 1;
      }
      ranks.push(r);
    }
    return ranks;
  }

  function getYear(d) {
    var t = parseDate(d);
    return t ? t.getFullYear() : '';
  }

  /** 散布図の点と連動ハイライト用に、行から一意のID文字列を取得する */
  function getRowId(row) {
    if (!row || typeof row !== 'object') return '';
    if (row['動物ID'] != null && String(row['動物ID']).trim() !== '') return String(row['動物ID']).trim();
    if (row['Official ID'] != null && String(row['Official ID']).trim() !== '') return String(row['Official ID']).trim();
    return '';
  }

  function getBirthDateFromRow(row) {
    var key = '生年月日';
    if (row[key] != null && row[key] !== '') return row[key];
    for (var i = 0; i < csvHeaders.length; i++) {
      var k = csvHeaders[i];
      if (!k) continue;
      var kTrim = k.replace(/\s/g, '').replace(/\uFEFF/g, '');
      if (kTrim === key || kTrim === '生年月日') return row[k];
    }
    for (var j = 0; j < csvHeaders.length; j++) {
      var h = csvHeaders[j];
      if (h && (String(h).indexOf('生年') !== -1 || String(h).indexOf('birth') !== -1 || String(h).indexOf('Birth') !== -1)) return row[h];
    }
    return null;
  }

  function renderScatterSet(containerId, xType, data, metrics, showYearAvg, benchmarks, showTrendLine) {
    var container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '<h3>' + (xType === 'date' ? '生年月日別 散布図' : '生年別 散布図') + '</h3><div class="scatter-grid"></div>';
    var grid = container.querySelector('.scatter-grid');

    var instances = chartInstancesByContainer[containerId];
    if (instances) {
      instances.forEach(function (c) { try { c.destroy(); } catch (e) {} });
      chartInstancesByContainer[containerId] = [];
    }

    var Chart = window.Chart;
    if (!Chart) return;

    var rows = data.rows;
    metrics.forEach(function (metric) {
      var values = rows.map(function (r) { return parseNum(r[metric]); });
      var labels = rows.map(function (r) { return xType === 'date' ? (getBirthDateFromRow(r) || '') : (getYear(getBirthDateFromRow(r)) || ''); });
      var valid = [];
      for (var i = 0; i < rows.length; i++) {
        var xRaw = labels[i];
        var y = values[i];
        var x = xType === 'date'
          ? (parseDate(xRaw) ? parseDate(xRaw).getTime() : null)
          : (xRaw ? parseInt(xRaw, 10) : null);
        if (x != null && !isNaN(x) && !isNaN(y)) valid.push({ x: x, y: y, row: rows[i], xLabel: xRaw });
      }
      valid.sort(function (a, b) { return a.x - b.x; });

      var canvas = document.createElement('canvas');
      var wrap = document.createElement('div');
      wrap.className = 'scatter-cell';
      wrap.appendChild(canvas);
      grid.appendChild(wrap);

      if (valid.length === 0 && xType === 'date') {
        wrap.innerHTML = '<p class="scatter-no-data">生年月日を解釈できるデータがありません。<br>CSVの「生年月日」列が YYYY-MM-DD や YYYY/MM/DD 形式か確認してください。</p>';
        return;
      }
      if (valid.length === 0) {
        wrap.innerHTML = '<p class="scatter-no-data">表示できるデータがありません。</p>';
        return;
      }

      var yearMeans = null;
      if (xType === 'year' && showYearAvg && valid.length > 0) {
        var byYear = {};
        valid.forEach(function (p) {
          var y = typeof p.x === 'number' ? (xType === 'date' ? new Date(p.x).getFullYear() : p.x) : parseInt(p.x, 10);
          if (!byYear[y]) byYear[y] = [];
          byYear[y].push(p.y);
        });
        yearMeans = Object.keys(byYear).map(function (y) {
          var arr = byYear[y];
          return { x: parseInt(y, 10), y: arr.reduce(function (a, b) { return a + b; }, 0) / arr.length };
        }).sort(function (a, b) { return a.x - b.x; });
      }

      var datasets = [{
        label: metric,
        data: valid.map(function (p) { return { x: p.x, y: p.y, row: p.row }; }),
        backgroundColor: 'rgba(37, 99, 235, 0.6)',
        borderColor: 'rgba(37, 99, 235, 1)',
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: function (ctx) {
          var raw = ctx.raw;
          if (!raw || !raw.row) return 'rgba(37, 99, 235, 0.6)';
          if (scatterHoveredId == null || scatterHoveredId === '') return 'rgba(37, 99, 235, 0.6)';
          return getRowId(raw.row) === scatterHoveredId ? 'rgba(234, 179, 8, 0.95)' : 'rgba(37, 99, 235, 0.25)';
        },
        pointBorderColor: function (ctx) {
          var raw = ctx.raw;
          if (!raw || !raw.row) return 'rgba(37, 99, 235, 1)';
          if (scatterHoveredId == null || scatterHoveredId === '') return 'rgba(37, 99, 235, 1)';
          return getRowId(raw.row) === scatterHoveredId ? 'rgba(234, 179, 8, 1)' : 'rgba(37, 99, 235, 0.4)';
        },
        pointRadius: function (ctx) {
          var raw = ctx.raw;
          if (!raw || !raw.row) return 4;
          if (scatterHoveredId == null || scatterHoveredId === '') return 4;
          return getRowId(raw.row) === scatterHoveredId ? 7 : 3;
        },
        pointHoverRadius: function (ctx) {
          var raw = ctx.raw;
          if (!raw || !raw.row) return 6;
          if (scatterHoveredId == null || scatterHoveredId === '') return 6;
          return getRowId(raw.row) === scatterHoveredId ? 9 : 5;
        }
      }];
      if (yearMeans && yearMeans.length > 0) {
        datasets.push({
          label: '年別平均',
          data: yearMeans,
          type: 'line',
          borderColor: '#d97706',
          backgroundColor: 'transparent',
          fill: false,
          pointRadius: 3,
          tension: 0.2
        });
      }

      var benchVal = benchmarks && benchmarks[metric] != null && benchmarks[metric] !== '' ? parseFloat(benchmarks[metric]) : null;
      if (!isNaN(benchVal) && valid.length > 0) {
        var minX = valid[0].x;
        var maxX = valid[valid.length - 1].x;
        datasets.push({
          label: '目標値',
          data: [{ x: minX, y: benchVal }, { x: maxX, y: benchVal }],
          type: 'line',
          borderColor: '#059669',
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0
        });
      }

      var trendReg = null;
      if (showTrendLine && valid.length >= 2) {
        trendReg = linearRegression(valid);
        if (trendReg) {
          var minX = valid[0].x;
          var maxX = valid[valid.length - 1].x;
          datasets.push({
            label: '近似曲線',
            data: [{ x: minX, y: trendReg.a * minX + trendReg.b }, { x: maxX, y: trendReg.a * maxX + trendReg.b }],
            type: 'line',
            borderColor: '#7c3aed',
            backgroundColor: 'transparent',
            fill: false,
            pointRadius: 0,
            borderDash: [2, 2]
          });
        }
      }

      var chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: metric },
          tooltip: {
            callbacks: {
              afterBody: function (tooltipItems) {
                var raw = tooltipItems[0] && tooltipItems[0].raw;
                if (raw && raw.row) {
                  var idStr = getRowId(raw.row);
                  return idStr !== '' ? 'ID: ' + idStr : '';
                }
                return '';
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            title: { display: true, text: xType === 'date' ? '生年月日' : '生年' },
            ticks: xType === 'date' ? {
              callback: function (val) {
                var d = new Date(val);
                return isNaN(d.getTime()) ? val : d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
              }
            } : {}
          },
          y: { title: { display: true, text: metric } }
        },
        onClick: function () {},
        onDblClick: function () {}
      };
      if (trendReg) {
        chartOptions.trendLineLabel = { reg: trendReg, metric: metric };
      }

      var chart = new Chart(canvas, {
        type: 'scatter',
        data: { datasets: datasets },
        options: chartOptions,
        plugins: [{
          id: 'trendLineLabel',
          afterDraw: function (chart) {
            var opts = chart.options.trendLineLabel;
            if (!opts || !opts.reg) return;
            var ctx = chart.ctx;
            var reg = opts.reg;
            var eq = 'y = ' + (reg.a.toFixed(4)) + 'x ' + (reg.b >= 0 ? '+' : '') + reg.b.toFixed(4);
            var r2Str = 'R² = ' + reg.r2.toFixed(4);
            var right = chart.scales.x.right;
            var top = chart.scales.y.top + 14;
            ctx.save();
            ctx.font = '11px sans-serif';
            ctx.fillStyle = '#7c3aed';
            ctx.textAlign = 'right';
            ctx.fillText(eq, right - 4, top);
            ctx.fillText(r2Str, right - 4, top + 14);
            ctx.restore();
          }
        }]
      });

      canvas.addEventListener('dblclick', function (e) {
        var chart = Chart.getChart(canvas);
        if (!chart) return;
        var pts = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false);
        if (pts.length > 0) {
          var di = pts[0].datasetIndex;
          var ii = pts[0].index;
          if (di !== 0) return;
          var pt = chart.data.datasets[di].data[ii];
          if (pt && pt.row) openDetailModal(pt.row);
        }
      });

      canvas.addEventListener('mousemove', function (e) {
        var chart = Chart.getChart(canvas);
        if (!chart) return;
        var pts = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false);
        var nextId = null;
        if (pts.length > 0 && pts[0].datasetIndex === 0) {
          var pt = chart.data.datasets[pts[0].datasetIndex].data[pts[0].index];
          if (pt && pt.row) nextId = getRowId(pt.row);
        }
        if (nextId !== scatterHoveredId) updateScatterHoverAndRedraw(nextId);
      });

      canvas.addEventListener('mouseout', function () {
        if (scatterHoveredId != null) updateScatterHoverAndRedraw(null);
      });

      if (!chartInstancesByContainer[containerId]) chartInstancesByContainer[containerId] = [];
      chartInstancesByContainer[containerId].push(chart);
      chartInstances.push(chart);
    });
  }

  function openDetailModal(row) {
    setLoading(false);
    var reportSection = document.getElementById('sectionReport');
    if (reportSection && reportSection.hidden) return;
    if (!row || typeof row !== 'object') {
      el.detailModalBody.innerHTML = '<p>個体データがありません。散布図の<strong>点</strong>をダブルクリックしてください（線や目標値の上ではありません）。</p>';
      el.detailModal.hidden = false;
      el.detailModal.style.display = '';
      return;
    }
    var metrics = getDisplayMetrics();
    var html = '<dl>';
    ['動物ID', 'Official ID', '動物名', '生年月日', '品種'].forEach(function (k) {
      if (csvHeaders.indexOf(k) !== -1 && row[k] != null) html += '<dt>' + escapeHtml(k) + '</dt><dd>' + escapeHtml(String(row[k])) + '</dd>';
    });
    MAIN_METRICS.forEach(function (m) {
      html += '<dt>' + escapeHtml(m) + '</dt><dd>' + formatNum(parseNum(row[m])) + '</dd>';
    });
    metrics.filter(function (m) { return MAIN_METRICS.indexOf(m) === -1; }).forEach(function (m) {
      html += '<dt>' + escapeHtml(m) + '</dt><dd>' + formatNum(parseNum(row[m])) + '</dd>';
    });
    if (csvHeaders.indexOf('BVDV Results') !== -1 && row['BVDV Results'] != null) {
      html += '<dt>BVDV Results</dt><dd>' + escapeHtml(String(row['BVDV Results'])) + '</dd>';
    }
    html += '</dl>';
    el.detailModalBody.innerHTML = html;
    el.detailModal.hidden = false;
    el.detailModal.style.display = '';
  }

  function collectBenchmarks() {
    var metrics = getDisplayMetrics();
    var bench = {};
    metrics.forEach(function (m) {
      var input = document.querySelector('.benchmark-inputs input[data-metric="' + m + '"]');
      if (input && input.value.trim() !== '') bench[m] = input.value.trim();
    });
    return bench;
  }

  /** 散布図のホバーIDを更新し、全散布図を再描画する。ID検索・表クリック・プロットホバーから呼ぶ */
  function updateScatterHoverAndRedraw(hoveredId) {
    scatterHoveredId = hoveredId;
    chartInstances.forEach(function (c) {
      try {
        if (c) c.update('none');
      } catch (err) {}
    });
  }

  /** IDで探す：検索実行して散布図をハイライトし、検索UIのメッセージを更新する */
  function runScatterIdSearch() {
    var v = el.scatterIdSearch && el.scatterIdSearch.value ? el.scatterIdSearch.value.trim() : '';
    if (v === '') {
      updateScatterHoverAndRedraw(null);
      if (el.scatterSearchMessage) el.scatterSearchMessage.textContent = '';
      return;
    }
    var found = reportRows.filter(function (r) { return getRowId(r) === v; })[0];
    if (found) {
      var idStr = getRowId(found);
      updateScatterHoverAndRedraw(idStr);
      if (el.scatterSearchMessage) el.scatterSearchMessage.textContent = 'ID ' + idStr + ' を強調中';
      if (el.scatterIdSearch) el.scatterIdSearch.value = idStr;
    } else {
      updateScatterHoverAndRedraw(null);
      if (el.scatterSearchMessage) el.scatterSearchMessage.textContent = '該当するIDはありません';
    }
  }

  /** IDで探すUIの表示とイベント紐付け。表のIDクリックで散布図連動する委譲もここで行う */
  function bindScatterIdSearch() {
    if (el.scatterSearchCard) {
      el.scatterSearchCard.hidden = false;
    }
    if (el.btnScatterIdSearch) {
      el.btnScatterIdSearch.onclick = runScatterIdSearch;
    }
    if (el.scatterIdSearch) {
      el.scatterIdSearch.onkeydown = function (e) {
        if (e.key === 'Enter') { e.preventDefault(); runScatterIdSearch(); }
      };
    }
    if (el.btnScatterIdClear) {
      el.btnScatterIdClear.onclick = function () {
        updateScatterHoverAndRedraw(null);
        if (el.scatterSearchMessage) el.scatterSearchMessage.textContent = '';
        if (el.scatterIdSearch) el.scatterIdSearch.value = '';
      };
    }
    var reportContent = document.getElementById('reportContent');
    if (reportContent) {
      if (!reportContent.hasAttribute('data-scatter-id-bound')) {
        reportContent.setAttribute('data-scatter-id-bound', '1');
        reportContent.addEventListener('click', function (e) {
          var target = e.target && e.target.closest ? e.target.closest('.scatter-id-link') : null;
          if (!target) return;
          var id = target.getAttribute('data-row-id');
          if (id != null && id !== '') {
            updateScatterHoverAndRedraw(id);
            if (el.scatterIdSearch) el.scatterIdSearch.value = id;
            if (el.scatterSearchMessage) el.scatterSearchMessage.textContent = 'ID ' + id + ' を強調中';
          }
        });
        reportContent.addEventListener('keydown', function (e) {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          var target = e.target && e.target.closest ? e.target.closest('.scatter-id-link') : null;
          if (!target) return;
          e.preventDefault();
          var id = target.getAttribute('data-row-id');
          if (id != null && id !== '') {
            updateScatterHoverAndRedraw(id);
            if (el.scatterIdSearch) el.scatterIdSearch.value = id;
            if (el.scatterSearchMessage) el.scatterSearchMessage.textContent = 'ID ' + id + ' を強調中';
          }
        });
      }
    }
  }

  function runReport() {
    if (isExpired()) { showError('利用期限が切れています。配布元にお問い合わせください。'); return; }
    if (!el.farmName.value.trim()) { showError('農場名を入力してください。'); return; }
    if (!el.mainMetric.value) { showError('総合指標を1つ選択してください。'); return; }
    if (rawRows.length === 0) { showError('CSVをアップロードしてください。'); return; }

    setLoading(true, 'レポート生成中...');
    setTimeout(function () {
      try {
        var dateFrom = el.dateFrom.value || null;
        var dateTo = el.dateTo.value || null;
        filteredRows = applyDateFilter(rawRows, dateFrom, dateTo);
        if (filteredRows.length === 0) {
          setLoading(false);
          showError('指定した期間に該当するデータがありません。');
          return;
        }
        reportRows = filteredRows;

        var main = el.mainMetric.value;
        var metrics = getMetricColumns();
        var displayMetrics = getDisplayMetrics();
        var showYearAvg = el.showYearAvg.checked;
        var benchmarks = collectBenchmarks();
        var data = { rows: filteredRows };
        var showTrendLine = el.showTrendLine && el.showTrendLine.checked;

        var sortedByMain = sortRows(filteredRows, main, getDirection(main));
        var sortedByDate = filteredRows.slice().sort(function (a, b) {
          var da = parseDate(a['生年月日']);
          var db = parseDate(b['生年月日']);
          return (da && db) ? db.getTime() - da.getTime() : 0;
        });

        var reportHeaderEl = document.getElementById('reportHeader');
        if (reportHeaderEl) reportHeaderEl.innerHTML = buildReportHeader(el.farmName.value.trim(), dateFrom, dateTo, filteredRows);

        el.dashboardCard.innerHTML = buildDashboard(data);
        var rankByMain = computeRanksByMetric(sortedByMain, main, getDirection(main));
        var rankMapByRow = {};
        for (var i = 0; i < sortedByMain.length; i++) {
          var row = sortedByMain[i];
          var key = (row['動物ID'] != null ? String(row['動物ID']) : '') + '\t' + (getBirthDateFromRow(row) != null ? String(getBirthDateFromRow(row)) : '');
          rankMapByRow[key] = rankByMain[i];
        }
        var rankByDate = sortedByDate.map(function (row) {
          var key = (row['動物ID'] != null ? String(row['動物ID']) : '') + '\t' + (getBirthDateFromRow(row) != null ? String(getBirthDateFromRow(row)) : '');
          return rankMapByRow[key];
        });
        el.table1Card.innerHTML = buildTable(sortedByMain, displayMetrics, '総合指標順位表', null, rankByMain);
        el.table2Card.innerHTML = buildTable(sortedByDate, displayMetrics, '生年月日順表', null, rankByDate);
        if (el.tableLegendCard) {
          el.tableLegendCard.innerHTML = buildTableColorLegend();
          el.tableLegendCard.hidden = false;
        }

        renderScatterSet('scatterDateCard', 'date', data, metrics, false, benchmarks, showTrendLine);
        renderScatterSet('scatterYearCard', 'year', data, metrics, showYearAvg, benchmarks, showTrendLine);

        el.sectionInput.hidden = true;
        el.sectionReport.hidden = false;
        el.btnBackEdit.style.display = 'inline-block';
        if (el.navTabInput) el.navTabInput.classList.remove('active');
        if (el.navTabReport) el.navTabReport.classList.add('active');

        scrollReportToTop();

        document.querySelectorAll('.col-header').forEach(function (th) {
          th.addEventListener('click', function () {
            var col = this.getAttribute('data-col');
            if (col) showTermPanel(col);
          });
        });
        bindTermSearch();
        bindScatterIdSearch();
        scheduleFileSave();
      } catch (err) {
        showError(err.message || 'レポート生成に失敗しました。');
      } finally {
        setLoading(false);
      }
    }, 50);
  }

  function showTermPanel(col) {
    var t = traitDictionary[col];
    if (!t) {
      el.termPanelContent.innerHTML = '<p>解説はありません: ' + escapeHtml(col) + '</p>';
    } else {
      var dir = t.direction === 'higher' ? '高いほど良い' : t.direction === 'lower' ? '低いほど良い' : '中庸（色分けなし）';
      el.termPanelContent.innerHTML =
        '<p><strong>' + escapeHtml(t.nameJa) + '</strong> (' + escapeHtml(col) + ')</p>' +
        (t.formalName ? '<p class="term-formal">正式名称: ' + escapeHtml(t.formalName) + '</p>' : '') +
        '<p>' + escapeHtml(t.desc) + '</p>' +
        '<p class="term-dir">評価の方向: ' + dir + '</p>' +
        (t.unit ? '<p>単位: ' + escapeHtml(t.unit) + '</p>' : '') +
        (t.tip ? '<div class="term-tip">TIP: ' + escapeHtml(t.tip) + '</div>' : '');
    }
    el.termPanel.hidden = false;
  }

  /** レポート表示時にスクロールを先頭に戻し、印刷ボタンが確実に見えるようにする */
  function scrollReportToTop() {
    requestAnimationFrame(function () {
      var wrap = document.querySelector('.app-main-wrap');
      if (wrap) wrap.scrollTop = 0;
      var reportActions = document.querySelector('.report-actions');
      if (reportActions) reportActions.scrollIntoView({ block: 'start', behavior: 'auto' });
    });
  }

  function bindTermSearch() {
    if (!el.termSearch || !el.termPanelContent) return;
    function renderList(items) {
      if (!el.termPanelContent) return;
      var list = items.map(function (m) {
        return '<li data-col="' + escapeHtml(m.key) + '">' + escapeHtml(m.t.nameJa) + ' (' + escapeHtml(m.key) + ')</li>';
      }).join('');
      el.termPanelContent.innerHTML = '<ul class="term-list">' + list + '</ul>';
      el.termPanelContent.querySelectorAll('.term-list li').forEach(function (li) {
        li.addEventListener('click', function () { showTermPanel(this.getAttribute('data-col')); });
      });
    }
    function runTermSearch() {
      var q = (el.termSearch.value || '').trim();
      var qLower = q.toLowerCase();
      if (!qLower) {
        renderList(Object.keys(traitDictionary).map(function (k) { return { key: k, t: traitDictionary[k] }; }));
        return;
      }
      var matched = [];
      Object.keys(traitDictionary).forEach(function (k) {
        var t = traitDictionary[k];
        var text = (t.nameJa + ' ' + k + ' ' + (t.synonyms || []).join(' ')).toLowerCase();
        if (text.indexOf(qLower) !== -1) matched.push({ key: k, t: t });
      });
      renderList(matched);
    }
    el.termSearch.oninput = runTermSearch;
    el.termSearch.onkeyup = runTermSearch;
  }

  function openTermPanelGlossary() {
    if (!el.termPanel) return;
    bindTermSearch();
    el.termPanel.hidden = false;
    if (el.termSearch) {
      el.termSearch.focus();
      el.termSearch.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function dateToYyyymmdd(d) {
    if (!d || !d.getFullYear) return '';
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var day = d.getDate();
    return y + '' + (m < 10 ? '0' + m : m) + '' + (day < 10 ? '0' + day : day);
  }

  function getPdfFilename() {
    var out = new Date();
    var dateStr = dateToYyyymmdd(out);
    var farmName = (el.farmName.value || '').trim().replace(/[\\/:*?"<>|]/g, '') || 'report';
    var rangeStr = '';
    if (filteredRows.length > 0) {
      var dates = filteredRows.map(function (r) { return parseDate(getBirthDateFromRow(r)); }).filter(Boolean);
      if (dates.length > 0) {
        var minT = Math.min.apply(null, dates.map(function (d) { return d.getTime(); }));
        var maxT = Math.max.apply(null, dates.map(function (d) { return d.getTime(); }));
        rangeStr = dateToYyyymmdd(new Date(minT)) + '‐' + dateToYyyymmdd(new Date(maxT));
      }
    }
    return dateStr + farmName + rangeStr + '.pdf';
  }

  function getLocalDataFilename() {
    var out = new Date();
    var dateStr = dateToYyyymmdd(out);
    var farmName = (el.farmName.value || '').trim().replace(/[\\/:*?"<>|]/g, '') || 'report';
    return 'dairynotebookgm_' + dateStr + '_' + farmName + '.json';
  }

  function wrapScatterCellsForPdf() {
    var grids = document.querySelectorAll('.scatter-grid');
    grids.forEach(function (grid) {
      var cells = Array.prototype.filter.call(grid.children, function (el) { return el.classList && el.classList.contains('scatter-cell'); });
      if (cells.length === 0) return;
      for (var i = 0; i < cells.length; i += 4) {
        var group = document.createElement('div');
        group.className = 'scatter-page-group';
        for (var j = 0; j < 4 && i + j < cells.length; j++) group.appendChild(cells[i + j]);
        grid.appendChild(group);
      }
    });
  }

  function unwrapScatterCellsForPdf() {
    var groups = document.querySelectorAll('.scatter-page-group');
    groups.forEach(function (group) {
      var grid = group.parentNode;
      if (!grid) return;
      while (group.firstChild) grid.insertBefore(group.firstChild, group);
      grid.removeChild(group);
    });
  }

  function openPrintView(mode) {
    mode = mode || 'all';
    var elReport = document.getElementById('reportContent');
    if (!elReport) {
      showError('レポートがありません。');
      return;
    }
    var clone = elReport.cloneNode(true);

    /** 印刷画面では個体検索（IDで探す）を除外する */
    var searchCard = clone.querySelector('#scatterSearchCard');
    if (searchCard) searchCard.remove();

    if (mode === 'tables') {
      var dashboard = clone.querySelector('#dashboardCard');
      var scatterDate = clone.querySelector('#scatterDateCard');
      var scatterYear = clone.querySelector('#scatterYearCard');
      if (dashboard) dashboard.remove();
      if (scatterDate) scatterDate.remove();
      if (scatterYear) scatterYear.remove();
    } else if (mode === 'graphs') {
      var dashboard = clone.querySelector('#dashboardCard');
      var tableLegend = clone.querySelector('#tableLegendCard');
      var table1 = clone.querySelector('#table1Card');
      var table2 = clone.querySelector('#table2Card');
      if (dashboard) dashboard.remove();
      if (tableLegend) tableLegend.remove();
      if (table1) table1.remove();
      if (table2) table2.remove();
      /** 全グラフを表示し、A4横1枚に4グラフ（2x2）でページ分割。グラフを大きくする */
      var dateCard = clone.querySelector('#scatterDateCard');
      var yearCard = clone.querySelector('#scatterYearCard');
      if (dateCard && yearCard) {
        var grid1 = dateCard.querySelector('.scatter-grid');
        var grid2 = yearCard.querySelector('.scatter-grid');
        var cells = [];
        if (grid1) {
          var list = grid1.querySelectorAll('.scatter-cell');
          for (var c = 0; c < list.length; c++) cells.push(list[c]);
        }
        if (grid2) {
          var list2 = grid2.querySelectorAll('.scatter-cell');
          for (var d = 0; d < list2.length; d++) cells.push(list2[d]);
        }
        var container = document.createElement('div');
        container.className = 'print-graphs-pages';
        for (var i = 0; i < cells.length; i += 4) {
          var wrapper = document.createElement('div');
          wrapper.className = 'print-graphs-grid';
          for (var j = 0; j < 4 && i + j < cells.length; j++) {
            wrapper.appendChild(cells[i + j].cloneNode(true));
          }
          container.appendChild(wrapper);
        }
        dateCard.parentNode.replaceChild(container, dateCard);
        yearCard.remove();
      }
    }

    var origCanvases = elReport.querySelectorAll('canvas');
    var cloneCanvases = clone.querySelectorAll('canvas');
    for (var i = 0; i < origCanvases.length && i < cloneCanvases.length; i++) {
      var img = document.createElement('img');
      img.src = origCanvases[i].toDataURL('image/png');
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.alt = 'グラフ';
      cloneCanvases[i].parentNode.replaceChild(img, cloneCanvases[i]);
    }

    var inlineCss = getPrintViewInlineCss(mode);
    var printCss = mode === 'graphs'
      ? '@page{size:A4 landscape;margin:10mm;}@media print{.print-report-body{padding:0.4rem 0.6rem!important;max-width:100%!important;}.print-report-body .report-header{padding:0.2rem 0.4rem!important;margin-bottom:0.25rem!important;page-break-after:avoid!important;break-after:avoid!important;}.print-report-body .report-header-dl{font-size:0.55rem!important;gap:0.05rem 0.35rem!important;}.print-report-body .report-header-dl .report-farm-name{font-size:0.7rem!important;}.print-report-body .report-brand-name{font-size:0.65rem!important;}.print-graphs-pages{display:block!important;}.print-graphs-grid{display:grid!important;grid-template-columns:repeat(2,1fr)!important;grid-template-rows:repeat(2,1fr)!important;gap:0.5rem!important;min-height:0!important;page-break-after:always!important;break-after:page!important;page-break-inside:avoid!important;break-inside:avoid!important;min-height:85vh!important;}.print-graphs-grid:last-child{page-break-after:auto!important;break-after:auto!important;}.print-graphs-grid .scatter-cell{min-height:0!important;page-break-inside:avoid!important;break-inside:avoid!important;}.print-graphs-grid .scatter-cell canvas,.print-graphs-grid .scatter-cell img{max-width:100%!important;max-height:100%!important;object-fit:contain!important;}.print-hint{display:none!important}}'
      : '@page{size:A4 portrait;margin:12mm;}@media print{.print-report-body{max-width:100%!important;padding:0.75rem!important;}.print-report-body .report-header{padding:0.4rem 0.6rem!important;margin-bottom:0.4rem!important;}.print-report-body .report-header-dl{font-size:0.65rem!important;gap:0.08rem 0.5rem!important;}.print-report-body .report-header-dl .report-farm-name{font-size:0.9rem!important;}.print-report-body .report-brand-name{font-size:0.75rem!important;}.print-report-body .card{padding:0.4rem 0.6rem!important;margin-bottom:0.4rem!important;}.print-report-body .dashboard-grid{gap:0.25rem!important;grid-template-columns:repeat(auto-fill,minmax(120px,1fr))!important;}.print-report-body .dashboard-item{padding:0.25rem 0.35rem!important;}.print-report-body .dashboard-item .metric-name{font-size:0.6rem!important;}.print-report-body .dashboard-item .avg,.print-report-body .dashboard-item .best,.print-report-body .dashboard-item .worst{font-size:0.55rem!important;}.print-report-body .report-page h3{font-size:0.75rem!important;margin-bottom:0.25rem!important;padding-bottom:0.15rem!important;}.print-report-body .table-legend-inner{padding:0.25rem 0.4rem!important;font-size:0.6rem!important;}.print-report-body .table-legend-title{font-size:0.7rem!important;}.print-report-body .table-legend-intro,.print-report-body .table-legend-list{font-size:0.6rem!important;line-height:1.25!important;}.print-report-body .table-legend-list li{margin-bottom:0.05rem!important;}.table-wrap{width:100%!important;max-width:100%!important;overflow:visible!important;}.report-table{width:100%!important;max-width:100%!important;table-layout:fixed!important;font-size:0.6rem!important;}.report-table th,.report-table td{padding:0.15rem 0.25rem!important;white-space:normal!important;word-break:break-word!important;overflow-wrap:break-word!important;}.report-table .report-table-title{font-size:0.65rem!important;padding:0.2rem 0.25rem!important;}.report-table thead{display:table-header-group}.report-table tr{page-break-inside:avoid;break-inside:avoid}.scatter-cell{page-break-inside:avoid;break-inside:avoid}.scatter-set h3{page-break-after:avoid}.print-hint{display:none!important}}';

    var title = mode === 'tables' ? '表のみ印刷 - DairyNotebookGM' : mode === 'graphs' ? 'グラフのみ印刷 - DairyNotebookGM' : '印刷 - DairyNotebookGM';
    var bodyClass = mode === 'graphs' ? ' print-mode-graphs' : '';
    var html = '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title>' + title + '</title><style>' + inlineCss + printCss + '</style></head><body class="print-view">' +
      '<div class="report-content print-report-body' + bodyClass + '">' + clone.innerHTML + '</div>' +
      '<p class="print-hint" style="margin:2rem 1.5rem;font-size:0.9rem;color:#666;">Ctrl+P で印刷してください。</p></body></html>';
    var blob = new Blob([html], { type: 'text/html; charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var win = window.open(url, '_blank', 'noopener');
    if (win) win.addEventListener('load', function () { URL.revokeObjectURL(url); });
    else {
      URL.revokeObjectURL(url);
      showError('ポップアップがブロックされています。ブラウザでポップアップを許可してください。');
    }
  }

  /** 印刷用ウィンドウ用のインラインCSS（外部スタイルに依存しない）。mode: 'all'|'tables'|'graphs' */
  function getPrintViewInlineCss(mode) {
    var r = ':root{--bg:#fff;--bg-card:#fafafa;--border:#e0e0e0;--text:#222;--text-muted:#555;--primary:#2563eb;--good:#059669;--good-bg:#d1fae5;--warn:#d97706;--warn-bg:#fef3c7;--space:1.25rem;}';
    r += '*{box-sizing:border-box;}';
    r += 'body{margin:0;font-family:\'Segoe UI\',\'Hiragino Sans\',\'Hiragino Kaku Gothic ProN\',sans-serif;background:var(--bg);color:var(--text);line-height:1.5;}';
    r += '.print-report-body{max-width:1200px;margin:0 auto;padding:1.5rem;}';
    r += '.report-content{margin-top:0;}';
    r += '.report-header{margin-bottom:var(--space);padding:var(--space);background:var(--bg-card);border:1px solid var(--border);border-radius:8px;}';
    r += '.report-header-inner{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;flex-wrap:wrap;}';
    r += '.report-header-dl{display:grid;grid-template-columns:auto 1fr;gap:0.25rem 1.5rem;margin:0;font-size:0.95rem;}';
    r += '.report-header-dl dt{margin:0;font-weight:600;color:var(--text-muted);}';
    r += '.report-header-dl dd{margin:0;}';
    r += '.report-header-dl .report-farm-name{font-size:1.5rem;font-weight:700;color:var(--text);}';
    r += '.report-branding{display:flex;align-items:center;gap:0.5rem;}';
    r += '.report-brand-name{font-size:1.25rem;font-weight:700;color:var(--primary);}';
    r += '.card{background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:var(--space);margin-bottom:var(--space);box-shadow:0 1px 3px rgba(0,0,0,0.08);}';
    r += '.print-report-body .report-header{padding:0.5rem 0.75rem;margin-bottom:0.5rem;}';
    r += '.print-report-body .report-header-dl{font-size:0.7rem;gap:0.1rem 0.6rem;}';
    r += '.print-report-body .report-header-dl .report-farm-name{font-size:1rem;}';
    r += '.print-report-body .report-brand-name{font-size:0.85rem;}';
    r += '.print-report-body .card{padding:0.5rem 0.75rem;margin-bottom:0.5rem;}';
    r += '.print-report-body .dashboard-grid{gap:0.35rem;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));}';
    r += '.print-report-body .dashboard-item{padding:0.3rem 0.45rem;}';
    r += '.print-report-body .dashboard-item .metric-name{font-size:0.65rem;margin-bottom:0.08rem;}';
    r += '.print-report-body .dashboard-item .avg,.print-report-body .dashboard-item .best,.print-report-body .dashboard-item .worst{font-size:0.6rem;}';
    r += '.print-report-body .report-page h3{font-size:0.85rem;margin-bottom:0.35rem;padding-bottom:0.2rem;}';
    r += '.print-report-body .table-legend-inner{padding:0.35rem 0.5rem;font-size:0.7rem;}';
    r += '.print-report-body .table-legend-title{font-size:0.8rem;margin-bottom:0.2rem;}';
    r += '.print-report-body .table-legend-intro{margin-bottom:0.25rem;font-size:0.65rem;line-height:1.3;}';
    r += '.print-report-body .table-legend-list{padding-left:1rem;line-height:1.35;font-size:0.65rem;}';
    r += '.print-report-body .table-legend-list li{margin-bottom:0.1rem;}';
    r += '.print-report-body .table-legend-swatch{width:0.65rem;height:0.65rem;margin-right:0.25rem;}';
    r += '.report-page{break-inside:avoid;page-break-inside:avoid;}';
    r += '.report-page h3{margin-top:0;margin-bottom:0.75rem;font-size:1.1rem;border-bottom:1px solid var(--border);padding-bottom:0.35rem;}';
    r += '.dashboard-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;}';
    r += '.dashboard-item{padding:0.75rem;background:var(--bg);border-radius:6px;border:1px solid var(--border);}';
    r += '.dashboard-item .metric-name{font-weight:600;font-size:0.9rem;margin-bottom:0.25rem;}';
    r += '.dashboard-item .avg,.dashboard-item .best,.dashboard-item .worst{font-size:0.85rem;}';
    r += '.dashboard-item .avg{color:var(--text-muted);}';
    r += '.dashboard-item .best{color:var(--good);}';
    r += '.dashboard-item .worst{color:var(--warn);}';
    r += '.table-wrap{overflow-x:auto;margin-top:0.5rem;}';
    r += '.report-table{width:100%;border-collapse:collapse;font-size:0.85rem;}';
    r += '.report-table th,.report-table td{padding:0.4rem 0.6rem;border:1px solid var(--border);text-align:left;white-space:nowrap;}';
    r += '.report-table th{background:#f1f5f9;font-weight:600;}';
    r += '.report-table .pct-good{background:var(--good-bg);}';
    r += '.report-table .pct-warn{background:var(--warn-bg);}';
    r += '.report-table .sticky-col{position:sticky;left:0;background:var(--bg-card);z-index:1;}';
    r += '.report-table th.sticky-col{background:#e2e8f0;}';
    r += '.report-table-title{text-align:left;font-size:1rem;padding:0.4rem 0.6rem!important;background:#e2e8f0!important;border:1px solid var(--border);}';
    r += '.print-report-body .table-wrap{width:100%;max-width:100%;overflow:visible;}';
    r += '.print-report-body .report-table{width:100%!important;max-width:100%;table-layout:fixed;font-size:0.6rem;}';
    r += '.print-report-body .report-table th,.print-report-body .report-table td{padding:0.15rem 0.25rem;white-space:normal;word-break:break-word;overflow-wrap:break-word;line-height:1.2;}';
    r += '.print-report-body .report-table .report-table-title{font-size:0.65rem!important;padding:0.2rem 0.25rem!important;}';
    r += '.table-legend-inner{padding:0.75rem 1rem;font-size:0.9rem;}';
    r += '.table-legend-title{margin:0 0 0.5rem;font-size:1rem;font-weight:600;}';
    r += '.table-legend-intro{margin:0 0 0.75rem;color:var(--text-muted);line-height:1.5;}';
    r += '.table-legend-list{margin:0;padding-left:1.25rem;list-style:disc;line-height:1.6;}';
    r += '.table-legend-list li{margin-bottom:0.35rem;}';
    r += '.table-legend-swatch{display:inline-block;width:1rem;height:1rem;margin-right:0.4rem;vertical-align:middle;border:1px solid var(--border);border-radius:2px;}';
    r += '.table-legend-swatch-good{background:var(--good-bg);}';
    r += '.table-legend-swatch-warn{background:var(--warn-bg);}';
    r += '.table-legend-swatch-none{background:var(--bg-card);}';
    r += '.scatter-set{padding:1rem;}';
    r += '#table2Card{page-break-before:always;}';
    r += '#scatterDateCard{page-break-before:always;}';
    r += '#scatterYearCard{page-break-before:always;}';
    r += '.scatter-grid{display:grid;grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(3,280px);gap:1rem;margin-top:0.75rem;}';
    r += '.scatter-cell{min-height:260px;position:relative;}';
    r += '.scatter-cell canvas,.scatter-cell img{max-width:100%;max-height:100%;display:block;}';
    r += '.scatter-no-data{padding:1rem;color:var(--text-muted);font-size:0.9rem;text-align:center;margin:0;}';
    if (mode === 'graphs') {
      r += '.print-report-body.print-mode-graphs{padding:0.4rem 0.6rem;display:flex;flex-direction:column;}';
      r += '.print-report-body.print-mode-graphs .report-header{padding:0.2rem 0.4rem;margin-bottom:0.25rem;}';
      r += '.print-report-body.print-mode-graphs .report-header-dl{font-size:0.55rem;gap:0.05rem 0.35rem;}';
      r += '.print-report-body.print-mode-graphs .report-header-dl .report-farm-name{font-size:0.7rem;}';
      r += '.print-report-body.print-mode-graphs .report-brand-name{font-size:0.65rem;}';
      r += '.print-graphs-pages{display:block;}';
      r += '.print-graphs-grid{display:grid;grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(2,1fr);gap:0.5rem;min-height:75vh;margin-bottom:1rem;}';
      r += '.print-graphs-grid .scatter-cell{min-height:0;}';
      r += '.print-graphs-grid .scatter-cell canvas,.print-graphs-grid .scatter-cell img{max-width:100%;max-height:100%;object-fit:contain;}';
    }
    return r;
  }

  function savePdf() {
    openPrintView('all');
  }

  function reset() {
    rawRows = [];
    filteredRows = [];
    csvHeaders = [];
    numericColumns = [];
    selectedAdditional = [];
    el.farmName.value = '';
    el.dateFrom.value = '';
    el.dateTo.value = '';
    el.csvFile.value = '';
    setCsvFileName(null);
    el.mainMetric.value = '';
    el.metricSearch.value = '';
    el.showYearAvg.checked = false;
    if (el.showTrendLine) el.showTrendLine.checked = false;
    renderChips();
    el.additionalMetricSelect.innerHTML = '';
    el.benchmarkInputs.innerHTML = '';
    el.sectionReport.hidden = true;
    el.sectionInput.hidden = false;
    el.btnBackEdit.style.display = 'none';
    chartInstances.forEach(function (c) { try { c.destroy(); } catch (e) {} });
    chartInstances = [];
  }

  function backToEdit() {
    el.sectionReport.hidden = true;
    el.sectionInput.hidden = false;
    el.btnBackEdit.style.display = 'none';
    if (el.navTabReport) el.navTabReport.classList.remove('active');
    if (el.navTabInput) el.navTabInput.classList.add('active');
    if (el.detailModal) el.detailModal.hidden = true;
    if (el.termPanel) el.termPanel.hidden = true;
  }

  function renderChips() {
    el.selectedChips.innerHTML = '';
    selectedAdditional.forEach(function (col) {
      var chip = document.createElement('span');
      chip.className = 'chip';
      chip.innerHTML = escapeHtml(col) + ' <button type="button" aria-label="解除">×</button>';
      chip.querySelector('button').addEventListener('click', function () {
        selectedAdditional = selectedAdditional.filter(function (c) { return c !== col; });
        renderChips();
        refillMetricDropdown();
        updateBenchmarkInputs();
        scheduleFileSave();
      });
      el.selectedChips.appendChild(chip);
    });
    if (el.selectedCount) el.selectedCount.textContent = selectedAdditional.length + '個選択';
  }

  function refillMetricDropdown() {
    var search = (el.metricSearch.value || '').trim().toLowerCase();
    var opts = numericColumns.filter(function (c) {
      if (MAIN_METRICS.indexOf(c) !== -1) return false;
      if (selectedAdditional.indexOf(c) !== -1) return false;
      if (search) {
        var t = traitDictionary[c];
        var text = (c + ' ' + (t ? t.nameJa + ' ' + (t.synonyms || []).join(' ') : '')).toLowerCase();
        return text.indexOf(search) !== -1;
      }
      return true;
    });
    el.additionalMetricSelect.innerHTML = opts.map(function (c) {
      return '<option value="' + escapeHtml(c) + '">' + escapeHtml(c) + '</option>';
    }).join('');
  }

  function updateBenchmarkInputs() {
    var metrics = getDisplayMetrics();
    el.benchmarkInputs.innerHTML = metrics.map(function (m) {
      return '<div class="b-item"><label>' + escapeHtml(m) + '</label><input type="number" step="any" data-metric="' + escapeHtml(m) + '" placeholder="目標値"></div>';
    }).join('');
  }

  function showHelp() { el.guideModal.hidden = false; }

  function initGuide() {
    if (!localStorage.getItem('dairynotebookgm_guide_shown')) {
      el.guideModal.hidden = false;
      localStorage.setItem('dairynotebookgm_guide_shown', '1');
    }
  }

  function setCsvFileName(file) {
    if (!el.csvFileName) return;
    if (file) {
      el.csvFileName.textContent = file.name;
      el.csvFileName.hidden = false;
    } else {
      el.csvFileName.textContent = '';
      el.csvFileName.hidden = true;
    }
  }

  el.csvFile.addEventListener('change', function () {
    var file = this.files[0];
    if (!file) {
      setCsvFileName(null);
      return;
    }
    setCsvFileName(file);
    setLoading(true, 'CSV読み込み中...');
    loadCsv(file).then(function (result) {
      numericColumns = result.numericColumns || [];
      refillMetricDropdown();
      updateBenchmarkInputs();
      if (result.dateFailCount > 0) showError('生年月日を解釈できなかった行が ' + result.dateFailCount + ' 件あり、除外しました。');
      setLoading(false);
      scheduleFileSave();
    }).catch(function (err) {
      showError(err.message);
      setCsvFileName(null);
      setLoading(false);
    });
  });

  var MAX_CSV_MB = 20;
  function setupCsvDropZone() {
    var zone = el.csvDropZone;
    var input = el.csvFile;
    if (!zone || !input) return;
    function validCsvFile(file) {
      if (!file || !file.type) return file.name && file.name.toLowerCase().endsWith('.csv');
      return file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv');
    }
    function handleDrop(e) {
      e.preventDefault();
      zone.classList.remove('drag-over');
      var files = e.dataTransfer && e.dataTransfer.files;
      if (!files || files.length === 0) return;
      var file = files[0];
      if (!validCsvFile(file)) {
        showError('CSVファイル（.csv）を選択してください。');
        return;
      }
      if (file.size > MAX_CSV_MB * 1024 * 1024) {
        showError('ファイルサイズは' + MAX_CSV_MB + 'MB以下にしてください。');
        return;
      }
      var dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      setCsvFileName(file);
      setLoading(true, 'CSV読み込み中...');
      loadCsv(file).then(function (result) {
        numericColumns = result.numericColumns || [];
        refillMetricDropdown();
        updateBenchmarkInputs();
        if (result.dateFailCount > 0) showError('生年月日を解釈できなかった行が ' + result.dateFailCount + ' 件あり、除外しました。');
        setLoading(false);
        scheduleFileSave();
      }).catch(function (err) {
        showError(err.message);
        setCsvFileName(null);
        setLoading(false);
      });
    }
    zone.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', function (e) {
      e.preventDefault();
      if (!zone.contains(e.relatedTarget)) zone.classList.remove('drag-over');
    });
    zone.addEventListener('drop', handleDrop);
    zone.addEventListener('click', function (e) {
      if (e.target.id === 'btnSelectCsv' || e.target.closest('#btnSelectCsv')) return;
      if (zone.contains(e.target)) input.click();
    });
    zone.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        input.click();
      }
    });
    if (el.btnSelectCsv) {
      el.btnSelectCsv.addEventListener('click', function (e) {
        e.stopPropagation();
        input.click();
      });
    }
  }
  setupCsvDropZone();

  el.additionalMetricSelect.addEventListener('dblclick', function () {
    var opt = this.options[this.selectedIndex];
    if (!opt || selectedAdditional.length >= MAX_ADDITIONAL) return;
    var v = opt.value;
    if (v && selectedAdditional.indexOf(v) === -1) {
      selectedAdditional.push(v);
      renderChips();
      refillMetricDropdown();
      updateBenchmarkInputs();
      scheduleFileSave();
    }
  });

  el.metricSearch.addEventListener('input', refillMetricDropdown);

  // ローカル保存 UI
  if (el.btnCreateDataFile) el.btnCreateDataFile.addEventListener('click', startNewMode);
  if (el.btnOpenDataFile) el.btnOpenDataFile.addEventListener('click', startSavedMode);
  if (el.btnSaveDataFile) el.btnSaveDataFile.addEventListener('click', function () {
    if (fileHandle) openSaveOptionsModal();
    else createLocalDataFile();
  });
  if (el.btnChangeSaveMode) el.btnChangeSaveMode.addEventListener('click', resetToInitialChoice);

  // 上書き／別名保存モーダル
  if (el.closeSaveOptionsModal) el.closeSaveOptionsModal.addEventListener('click', closeSaveOptionsModal);
  if (el.saveOptionsModal) el.saveOptionsModal.addEventListener('click', function (e) { if (e.target === el.saveOptionsModal) closeSaveOptionsModal(); });
  if (el.btnOverwriteSave) el.btnOverwriteSave.addEventListener('click', function () { closeSaveOptionsModal(); writeToFile(); });
  if (el.btnSaveAsNew) el.btnSaveAsNew.addEventListener('click', saveAsNewFile);
  if (el.btnCancelSaveOptions) el.btnCancelSaveOptions.addEventListener('click', closeSaveOptionsModal);

  if (!FS_SUPPORTED) {
    if (el.btnOpenDataFile) el.btnOpenDataFile.disabled = true;
    if (el.btnCreateDataFile) el.btnCreateDataFile.disabled = true;
    if (el.btnSaveDataFile) el.btnSaveDataFile.disabled = true;
    var fsHint = document.createElement('p');
    fsHint.className = 'form-hint';
    fsHint.style.color = '#dc2626';
    fsHint.textContent = 'File System Access API 未対応のため利用不可（Chrome / Edge をご使用ください）';
    if (el.localSaveInitialChoice) el.localSaveInitialChoice.appendChild(fsHint);
  }

  el.btnGenerate.addEventListener('click', runReport);
  el.btnReset.addEventListener('click', reset);
  el.btnBackEdit.addEventListener('click', backToEdit);
  el.btnBackEdit2.addEventListener('click', backToEdit);
  el.btnSavePdf.addEventListener('click', savePdf);
  if (el.btnPrintTables) el.btnPrintTables.addEventListener('click', function () { openPrintView('tables'); });
  if (el.btnPrintGraphs) el.btnPrintGraphs.addEventListener('click', function () { openPrintView('graphs'); });
  el.closeTermPanel.addEventListener('click', function () { el.termPanel.hidden = true; });
  el.closeDetailModal.addEventListener('click', function () { el.detailModal.hidden = true; });
  el.detailModal.addEventListener('click', function (e) { if (e.target === el.detailModal) el.detailModal.hidden = true; });
  el.btnHelp.addEventListener('click', showHelp);
  if (el.btnTermGlossary) el.btnTermGlossary.addEventListener('click', openTermPanelGlossary);
  if (el.navTabInput) el.navTabInput.addEventListener('click', function () {
    el.sectionInput.hidden = false;
    el.sectionReport.hidden = true;
    el.navTabReport.classList.remove('active');
    el.navTabInput.classList.add('active');
  });
  if (el.navTabReport) el.navTabReport.addEventListener('click', function () {
    el.sectionReport.hidden = false;
    el.sectionInput.hidden = true;
    el.navTabInput.classList.remove('active');
    el.navTabReport.classList.add('active');
  });
  if (el.btnAllTerms) el.btnAllTerms.addEventListener('click', function () {
    if (el.termSearch) {
      el.termSearch.value = '';
      el.termSearch.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  el.closeGuideModal.addEventListener('click', function () { el.guideModal.hidden = true; });
  el.btnGuideOk.addEventListener('click', function () { el.guideModal.hidden = true; });
  el.guideModal.addEventListener('click', function (e) { if (e.target === el.guideModal) el.guideModal.hidden = true; });

  initGuide();
  bindTermSearch();
  applyExpiry();
})();
