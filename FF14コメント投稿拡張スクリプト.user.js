// ==UserScript==
// @name        FF14コメント投稿拡張スクリプト
// @namespace   nohohon
// @author      nohohon
// @description FF14のコメント投稿で表示サイズ変更、プレビュー機能を追加する
// @include     http://jp.finalfantasyxiv.com/lodestone/character/*
// @version     1
// @grant       none
// ==/UserScript==
(function(){

    /** 
    * コメント入力欄を縦にリサイズ出来るようにする
    */
    function addCommentResize() {
        //コメント入力欄のスタイルを変更
        var elemComment = document.getElementById('input_comment');
        if(elemComment != null) {
            elemComment.setAttribute('style','resize:vertical;');
        }
    }

    /** 
    * プレビューボタンを追加する
    */
    function addPreviewButton() {
        //送信ボタンの要素を取得
        var elemSend = document.evaluate('//*[@id="commentbox_in"]/div/div/div/form/input[2]',
                                        document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null );
        if(elemSend.snapshotLength){
             //確認ボタンと送信ボタンを並べたHTMLを定義
            var btnHtml = [
                    '<div class="btn_area" style="margin-top:10px">',
                    '    <a class="button bt_confirm" id="comment_preview_btn"></a>',
                    '    <input value="" class="button bt_send" type="submit">',
                    '</div>'
            ].join('');
            //追加したい要素の生成（dummyのdivを使う）
            var divElem       = document.createElement('div');
            divElem.innerHTML = btnHtml;
            var itemSend = elemSend.snapshotItem(0);
            //要素の追加と削除
            itemSend.parentNode.insertBefore(divElem, itemSend);
            itemSend.parentNode.removeChild(itemSend);
            //確認ボタンのイベント追加
            document.getElementById('comment_preview_btn').addEventListener('click',previewComment,false);
        }
    }

    /** 
    * コメントをプレビューする
    */
    function previewComment() {
        //プレビュー用のHTMLを定義
        var previewHtml = createPreviewHtml();
        //プレビュー用の要素が追加されていない場合、要素を追加
        var elemPreviewComment = document.getElementById('preview_comment');
        if(elemPreviewComment == null) {
            elemPreviewComment = document.createElement('div');
            elemPreviewComment.setAttribute('class','comment')
            elemPreviewComment.setAttribute('id','preview_comment')
            elemPreviewComment.setAttribute('name','preview_comment')
            var elemCommentList = document.getElementsByClassName('comment_list')[0];
            elemCommentList.appendChild(elemPreviewComment);
        }
        //プレビュー用のHTMLの更新とページ内移動
        elemPreviewComment.innerHTML = previewHtml;
        window.location.href = '#preview_comment';
    }

    /** 
    * プレビュー用のHTMLを生成する
    */
    function createPreviewHtml() {
        //動的に変更される値を取得
        var elemComment = document.getElementById('input_comment');
        var date = new Date();
        var dateString = date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2)+
                                ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
        var elemPlayerId = document.evaluate('//*[@id="commentbox_in"]/div/div/div/form/div/div/div/div[1]',
                                        document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null ).snapshotItem(0);
        var faceRadioList = document.getElementsByName('face_emotion_id');
        var srcFaceImage;
        for(var i=0; i<faceRadioList.length; i++){
            if (faceRadioList[i].checked) {
                srcFaceImage = faceRadioList[i].parentNode.children[0].getAttribute('src');
                break;
            }
        }
        //HTMLを生成
        var previewHtml = [
                '<div class="clearfix">',
                '    <div class="thumb">',
                '        <img src="',srcFaceImage,'" alt="" height="50" width="50">',
                '    </div>',
                '    <div class="balloon_header"><div class="balloon_footer"><div class="balloon_body"><div class="balloon_body_inner">',
                elemComment.value.replace(/[\n\r]/g, '<br />'),
                '    </div></div></div></div>',
                '</div>',
                '<div class="tr relative">',
                '   <div style="color:#ff0000;margin-top:7px;margin-bottom:4px;">コメント確認</div>',
                '   <div class="player_id">',elemPlayerId.innerHTML,'</div>',
                '    <span class="ml5 pr6"> ',
                '        <span>',dateString,'</span>',
                '    </span>',
                '</div>',
            ].join('');
            return previewHtml;
    }

    //==================================================
    /** メイン関数 */
    //==================================================
    function main() {
		addCommentResize();
        addPreviewButton();
    }
    //メイン関数の呼び出し
    main();
})();