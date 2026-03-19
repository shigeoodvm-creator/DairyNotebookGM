このフォルダに以下のファイルを配置してください（オフライン用）。

1. papaparse.min.js
   https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js
   または https://unpkg.com/papaparse@5.4.1/papaparse.min.js

2. chart.umd.min.js
   https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js
   または https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js

3. html2pdf.bundle.min.js
   https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js
   または https://unpkg.com/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js

ブラウザで上記URLを開き「名前を付けて保存」するか、
PowerShell で以下を実行（NotebookGM フォルダで）:

Invoke-WebRequest -Uri "https://unpkg.com/papaparse@5.4.1/papaparse.min.js" -OutFile "libs/papaparse.min.js"
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js" -OutFile "libs/chart.umd.min.js"
Invoke-WebRequest -Uri "https://unpkg.com/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js" -OutFile "libs/html2pdf.bundle.min.js"
