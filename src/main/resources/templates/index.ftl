<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>路由平台</title>
    <link type="text/css" rel="stylesheet" href="/static/css/ui/socui.css"/>
    <link type="text/css" rel="stylesheet" href="/static/css/iconfont/iconfont.css"/>
    <script type="text/javascript" src="/static/js/lib/jquery-3.2.1.min.js"></script>
    <script type="text/javascript" src="/static/js/plus/common/common.validate.js"></script>
    <script type="text/javascript" src="/static/js/ui/jquery.socui.min.js"></script>
    <script type="text/javascript" src="/static/js/ui/jquery.socui.extend.min.js"></script>
    <script type="text/javascript" src="/static/js/ui/extension/jquery.messager.auto.js"></script>
    <script type="text/javascript" src="/static/js/templates/index.js"></script>
    <style>
        .bh-common-panelBt {
            margin: 10px 0;
        }
    </style>
    <script type="text/javascript">
        let $soc = {
            basePath: '${basePath}'
        };
    </script>
</head>
<body>
<div class="bh-common-panelBt">
    <form id="form" method="post">
        <table class="bh-common-table">
            <tr>
                <td class="title">协议</td>
                <td class="colon">:</td>
                <td class="content">
                    <input class="socui-combobox" id="schema" name="schema" data-options="required:true,panelHeight:150">
                </td>

                <td class="title">类型</td>
                <td class="colon">:</td>
                <td class="content" colspan="2">
                    <input class="socui-combobox" id="method" name="method" data-options="required:true,panelHeight:150">
                </td>

                <td class="title">转向地址</td>
                <td class="colon">:</td>
                <td class="content">
                    <input class="socui-textbox" id="url" name="url" data-options="required:true"/>
                </td>

                <td class="title">劫持路径</td>
                <td class="colon">:</td>
                <td class="content">
                    <input class="socui-textbox" id="path" name="path" data-options="required:true"/>
                </td>

                <td>
                    <div id="addBt" class="socui-linkbutton"
                         data-options="iconCls:'soc-icon-add'"
                         onclick="doAdd()" locale="button.add">添加
                    </div>
                </td>
            </tr>
        </table>
    </form>
</div>
<div class="bh-common-panel">
    <table class="socui-datagrid" id="grid" data-options="singleSelect:false, pagination:false"
           style="width:100%;height:300px">
        <thead data-options="frozen:true">
        <tr>
            <th data-options="field:'m', checkbox:true, resizable:false"></th>
        </tr>
        </thead>
        <thead>
        <tr>
            <th data-options="field:'schema', resizable:false" width="10%">协议</th>
            <th data-options="field:'method', resizable:false" width="10%">类型</th>
            <th data-options="field:'path', resizable:false" width="30%">劫持路径</th>
            <th data-options="field:'host', resizable:false" width="30%">转向地址</th>
            <th data-options="field:'port', resizable:false" width="15%">转向端口</th>
            <th data-options="field:'del', resizable:false, align: 'center', formatter: delFormatter, fix:true" width="70"></th>
        </tr>
        </thead>
    </table>
</div>
</body>
</html>