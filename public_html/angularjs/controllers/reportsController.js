var reportsModule = angular.module('mainModule');
reportsModule.controller('reportsController', function ($scope, $http, $filter, $rootScope, $cookieStore, serverURL, SERVER_CONSTANTS, $timeout, fetchAPIDataService) {

    function toTimestamp(strDate) {
        var datum = Date.parse(strDate);
        return datum / 1000;
    }

    $scope.data.getHTTPData = function (url) {
        var arrayTemp = '';
        arrayTemp = fetchAPIDataService.async(url).then(function (d) {
            return d;
        })
        //  console.log(arrayTemp);
    }


    $scope.data.getHTTPData(serverURL + 'getAllAssets')

    $scope.data.geberateExcel = function () {
        try {
            if ($scope.data.reportsArrayData.length > 0) {
                var fileName = 'Filename';
                $("#exportTable").table2excel({
                    exclude: ".noExl",
                    name: "Event Stats File",
                    filename: "Event Stats File" + fileName,
                    fileext: ".xls",
                    exclude_img: true,
                    exclude_links: true,
                    exclude_inputs: true
                });
            } else {
                $scope.data.reportsErrorStatus = true;
                $scope.data.reportsErrorMessage = 'No data on table';
            }
        } catch (e) {
            console.log(e);
        }
    }







    $scope.data.generatePDFTest = function (title) {
        var fullnames = $cookieStore.get('fullnames')
//        var doc = new jsPDF();
//        doc.text(15, 20, 'Ticket');
//        
//        doc.text(15, 30, '<u>This is client-side Javascript, pumping out a PDF.</u>');
        var divContents = $("#printArea").html();
        var today = new Date();
        var printWindow = window.open('', '_blank', 'height=400,width=800');
        printWindow.document.write('<html><head><title>Flex Communications</title>');
        printWindow.document.write('</head><body >');
        printWindow.document.write('<h2>' + title + '</h2><hr>');
        printWindow.document.write(divContents);
        printWindow.document.write('<br><br><br><hr>');
        printWindow.document.write('<div style=min-height:50;float:right;border:1px black solid;><b >Printed By : ' + fullnames + '</b> on : ' + today + '</div>');
        printWindow.document.write('</body></html>');
        printWindow.document.close('');
        printWindow.focus()
        printWindow.print();
//          
//        doc.text(15, 40, 'Do you like that?');
//         doc.save('PDF Report.pdf');

        //      $("#button").click(function () {
        //$(this).hide();  
        // $("#printArea").printArea();

        //  });
    }
    $scope.data.genPdf = function () {

    }



    $scope.data.generatePDF = function () {

        var table1 =
                tableToJson($('#exportTable').get(0)),
                cellWidth = 21,
                rowCount = 0,
                cellContents,
                leftMargin = 2,
                topMargin = 11,
                topMarginTable = 30,
                headerRowHeight = 13,
                rowHeight = 8,
                l = {
                    orientation: 'l',
                    unit: 'mm',
                    format: 'a4',
                    compress: true,
                    fontSize: 8,
                    lineHeight: 1,
                    overflow: 'linebreak',
                    autoSize: true,
                    printHeaders: true
                };
        var doc = new jsPDF();
        doc.setProperties({
            title: 'PDF History Document',
            subject: 'History Report',
            author: 'author',
            keywords: 'flex tracker',
            creator: 'Flex Communications Systems'
        });
        doc.cellInitialize();
        $.each(table1, function (i, row)
        {

            rowCount++;
            $.each(row, function (j, cellContent) {

                if (rowCount == 1) {
                    doc.margins = 0;
                    doc.setFont("helvetica");
                    doc.setFontType("bold");
                    doc.setFontSize(9);
                    doc.cell(leftMargin, topMargin, cellWidth, headerRowHeight, cellContent, i)
                } else if (rowCount == 2) {
                    doc.margins = 0;
                    doc.setFont("courier ");
                    doc.setFontType("bolditalic"); // or for normal font type use ------ doc.setFontType("normal");
                    doc.setFontSize(7);
                    doc.cell(leftMargin, topMargin, cellWidth, rowHeight, cellContent, i);
                } else {

                    doc.margins = 0;
                    doc.setFont("courier ");
                    doc.setFontType("bolditalic ");
                    doc.setFontSize(7);
                    doc.cell(leftMargin, topMargin, cellWidth, rowHeight, cellContent, i); // 1st=left margin    2nd parameter=top margin,     3rd=row cell width      4th=Row height
                }
            })
        })

        doc.save('PDF Report.pdf');
    }




    function tableToJson(table) {
        var data = [];
// first row needs to be headers
        var headers = [];
        for (var i = 0; i < table.rows[0].cells.length; i++) {
            headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi, '');
        }

// go through cells
        for (var i = 0; i < table.rows.length; i++) {

            var tableRow = table.rows[i];
            var rowData = {};
            for (var j = 0; j < tableRow.cells.length; j++) {

                rowData[ headers[j] ] = tableRow.cells[j].innerHTML;
            }

            data.push(rowData);
        }

        return data;
    }



})