<?php
//javascriptからajax非同期通信で呼ばれるapiプログラム

//アクセスはすべてjson、utf-8で返す
header("Content-Type: application/json; charset=utf-8");

//もしリクエストがhttp getメソッドなら
if($_SERVER["REQUEST_METHOD"] == "POST"){
    //httpステータスコードを200に
    http_response_code(200);
    $param = $_POST['param'];
    $eventType = $param['type'];
    //リクエストがどのタイプかによって処理を変更
    switch($eventType){
        case 'sync':
            sync($param);
        break;
        case 'add':
            add($param);
        break;
        case 'remove':
            remove($param);
        break;
    }
}else{
    //httpステータスコードを400に
    http_response_code(400);
}

//タスク一覧を取得する関数
function sync($param){
    //クッキーにタスクがセットされているなら
    if(isset($_COOKIE['tasks'])){
        //クッキーからタスクのjsonデータを取り出して出力
        $json = $_COOKIE['tasks'];
        print($json);
    }else{
        //クッキーにタスクがセットされていないなら初回なので空のデータを返す
        print('{}');
    }
}

//タスクを追加する関数
function add($param){
    
    //postで送られてきたタスクデータを取得
    $task = $param['task'];
    
    $task_array = array();
    $current_id = 1;
    if(isset($_COOKIE['tasks'])){
        
        //現在のクッキーに入っているタスク一覧データを取り出す
        $json = $_COOKIE['tasks'];
        $task_array = json_decode($json);
        //クッキーに入ってるidカウンターをインクリメント
        $current_id = $_COOKIE['id_count']+1;
        setcookie('id_count',$current_id);
    }
    
    //task_idはCookieで管理しているidを自動付加
    $task['task_id'] = $current_id;
    //タスク一覧に送られてきたタスクを追加する
    array_push($task_array,$task);
    //クッキーにタスクを保存
    setcookie('tasks',json_encode($task_array));
    //成功したことを返す
    print('{"message":"success"}');
}

//タスクを削除する関数
function remove($param){
    $task_id = $param['id'];
    //現在のクッキーに入っているタスク一覧データを取り出す
    $json = $_COOKIE['tasks'];
    $task_array = json_decode($json);
    for($i=0;$i<count($task_array);$i++){
        
        $id = $task_array[$i]->task_id;
        if($id == $task_id){
            break;
        }
    }
    //i番目の要素を削除
    array_splice($task_array,$i,1);
    //クッキーにタスクを保存
    setcookie('tasks',json_encode($task_array));
    print('{"message":"success"}');
}

?>