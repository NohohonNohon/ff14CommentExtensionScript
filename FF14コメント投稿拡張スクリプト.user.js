// ==UserScript==
// @name        FF14コメント投稿拡張スクリプト
// @namespace   nohohon
// @author      nohohon
// @description FF14のコメント投稿で表示サイズ変更、プレビュー機能を追加する
// @include     https://jp.finalfantasyxiv.com/lodestone/character/*
// @include     http://jp.finalfantasyxiv.com/lodestone/character/*
// @version     1.2
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
        var elemSend = document.evaluate('//*[@id="commentbox_in"]/div/form/div[2]/input',
                                        document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null );
        if(elemSend.snapshotLength){
             //確認ボタンと送信ボタンを並べたHTMLを定義
            var btnHtml = [
                    '<ul class="btn__color__nav--radius">',
                    '	<li><a id="comment_preview_btn">確認</a></li>',
                    '	<li class="form__submit"><input type="submit" value="送信" class=""></li>',
                    '</ul>'
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
            elemPreviewComment.setAttribute('id','preview_comment')
            elemPreviewComment.setAttribute('name','preview_comment')
            var elemCommentList = document.getElementsByClassName('ldst__window')[0];
            elemCommentList.appendChild(elemPreviewComment);
        }
        //プレビュー用のHTMLの更新とページ内移動
        elemPreviewComment.innerHTML = previewHtml;
        setTimeout(function(){
            window.location.href = '#preview_comment';
        }, 100);
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
        var elemPlayerName = document.evaluate('//*[@id="community"]/div[4]/div[2]/div[2]/div[4]/div[2]/a[1]/div/p[1]',
                                        document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null ).snapshotItem(0);
        var elemPlayerServer = document.evaluate('//*[@id="community"]/div[4]/div[2]/div[2]/div[4]/div[2]/a[1]/div/p[2]',
                                        document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null ).snapshotItem(0);
        var faceRadioList = document.getElementsByName('face_emotion_id');
        var srcFaceImage;
        for(var i=0; i<faceRadioList.length; i++){
            if (faceRadioList[i].checked) {
                srcFaceImage = faceRadioList[i].parentNode.children[1].children[0].getAttribute('src');
                break;
            }
        }
        //HTMLを生成
        var previewHtml = [
                    '<div class="entry">',
                    '	<a class="entry__link">',
                    '		<div class="entry__chara__face">',
                    '			<img src="',srcFaceImage,'" alt="" height="50" width="50">',
                    '		</div>',
                    '		<div class="entry__box">',
                    '			<p class="entry__name">',elemPlayerName.innerHTML,'</p>',
                    '			<p class="entry__world">',elemPlayerServer.innerHTML,'</p>',
                    '			<time class="entry__time--comment"> ',
                    '			<span>',dateString,'</span>',
                    '			</time>',
                    '		</div>',
                    '	</a>',
                    '</div>',
                    '<div class="thread__comment__body">',
                    elemComment.value.replace(/[\n\r]/g, '<br />'),
                    '</div>',
                    '<div style="color:#ff0000;margin-top:7px;margin-bottom:4px;margin-left:16px;">コメント確認</div>',
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