$(document).ready(function () {
    initContent();
});

/**
 * 初始化函数
 */
function initContent() {
    doPageLayout();
    queryGrid();
    loadCombo();

    window.onresize = function () {
        doPageLayout();
    }
}

/**
 * 布局函数
 */
function doPageLayout() {
    let win_w = $(window).width();
    let win_h = $(window).height();
    let top = $('.bh-common-panel').position().top;
    $('#grid').datagrid('resize', {
        width: win_w - 10,
        height: win_h - top - 5
    });
}

/**
 * 查询列表
 */
function queryGrid() {
    $.ajax({
        type: "GET",
        dataType: 'json',
        url: $soc.basePath + "/kidnap",
        loading: true,
        success: function(data) {
            $('#grid').datagrid('loadData', data);
        }
    });
}

/**
 * 加载下拉框
 */
function loadCombo() {
    $('#schema').combobox('loadData', [
        {value: 'http', text: 'http'},
        {value: 'https', text: 'https'}
    ]);
    $('#schema').combobox('setValue', 'http');

    $('#method').combobox('loadData', [
        {value: 'GET', text: 'GET'},
        {value: 'POST', text: 'POST'},
        {value: 'PUT', text: 'PUT'},
        {value: 'DELETE', text: 'DELETE'}
    ]);
    $('#method').combobox('setValue', 'GET');
}

/**
 * 删除按钮
 * @param value
 * @param row
 * @param index
 */
function delFormatter(value, row, index) {
    return '<div class="datagrid-op" onclick="doDel(\'' + index + '\')">删除</div>';
}

/**
 * 添加
 */
function doAdd() {
    let form = $('#form');
    if (form.form('validate')) {
        let data = form.form('collectData');
        data.host = getHost(data.url);
        data.port = getPort(data.url);
        console.log($soc);
        $.ajax({
            url: $soc.basePath + "/kidnap",
            type: "POST",
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log(data);
                if (data.code === 200) {
                    $.messager.auto({
                        msg: '添加成功',
                        icon: 'success',
                        onClose: function () {
                            $('#url').textbox('setValue', '');
                            $('#path').textbox('setValue', '');
                            queryGrid();
                        }
                    });
                } else {
                    $.messager.alert({msg: '添加失败', icon: 'error'});
                }
            }
        });
    }
}

function getHost(url) {
    if (url.indexOf(":") !== -1) {
        return url.substring(0, url.indexOf(":"));
    } else {
        return url;
    }
}

function getPort(url) {
    if (url.indexOf(":") !== -1) {
        return url.substring(url.indexOf(":") + 1, url.length);
    } else {
        return null;
    }
}

/**
 * 删除
 * @param index
 */
function doDel(index) {
    let row = $('#grid').datagrid('getRows')[index];
    $.messager.confirm({
        msg: '确认删除吗？',
        fn: function (data) {
            if (data) {
                $.ajax({
                    type: "DELETE",
                    dataType: 'json',
                    url: $soc.basePath + "/kidnap/" + row.id,
                    loading: true,
                    success: function(data) {
                        if (data.code === 200) {
                            queryGrid();
                        }
                    }
                });
            }
        }
    });
}