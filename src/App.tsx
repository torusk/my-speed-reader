import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { GlobalStyle } from "./styles/GlobalStyle"; // パスが正しいか確認してください

// --- Styled Components Definition ---

const AppContainer = styled.div`
  max-width: 700px;
  margin: 20px auto;
  padding: 25px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: "Yu Gothic", "Hiragino Kaku Gothic Pro", "Noto Sans JP",
    sans-serif;
  position: relative; // モーダルの親要素として
`;

const FixedTitle = styled.h1`
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
`;

const TextDisplayArea = styled.textarea`
  width: 100%;
  height: 300px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  line-height: 1.7;
  resize: none;
  margin-bottom: 20px;
  box-sizing: border-box;
  background-color: #f9f9f9;
  color: #333;

  &:read-only {
    background-color: #e9ecef;
    color: #555;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ButtonContainer = styled.div`
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const Message = styled.p`
  font-size: 16px;
  color: #555;
  min-height: 24px;
  margin-top: 5px;
`;

const BaseButton = styled.button`
  padding: 12px 28px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  min-width: 120px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StartButton = styled(BaseButton)`
  background-color: #28a745;
  color: white;
  &:hover:not(:disabled) {
    background-color: #218838;
  }
`;

const StopButton = styled(BaseButton)`
  background-color: #dc3545;
  color: white;
  &:hover:not(:disabled) {
    background-color: #c82333;
  }
`;

// --- Modal Styled Components ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  text-align: left;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
`;

const ModalResultItem = styled.p`
  font-size: 18px;
  color: #333;
  margin: 10px 0;
  line-height: 1.6;
`;

const ModalComment = styled(ModalResultItem)`
  font-style: italic;
  color: #555;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 6px;
`;

const ModalCloseButton = styled(BaseButton)`
  background-color: #6c757d;
  color: white;
  display: block; // ボタンをブロック要素にして中央揃えしやすくする
  margin: 25px auto 0; // 上マージンと左右autoで中央揃え
  &:hover:not(:disabled) {
    background-color: #5a6268;
  }
`;

// --- Result Data Interface (Optional but good practice) ---
interface ResultData {
  time: number;
  speed: number;
  comment: string;
}

// --- App Component ---
export const App: React.FC = () => {
  const [text, setText] = useState<string>(""); // ユーザーが入力するテキスト
  const [isReading, setIsReading] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false); // 計測が完了したか
  const [startTime, setStartTime] = useState<number>(0);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [resultData, setResultData] = useState<ResultData | null>(null);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // 結果表示後（モーダル表示中）や計測中はテキストエリアの編集をさせない
    if (isReading || isFinished) return;
    setText(event.target.value);
  };

  const handleStart = () => {
    if (!text.trim()) return;
    // 既存の結果表示関連のstateをリセット
    setIsFinished(false);
    setIsModalOpen(false);
    setResultData(null);

    setStartTime(Date.now());
    setIsReading(true);
  };

  const handleStop = () => {
    const currentEndTime = Date.now();
    setIsReading(false);
    setIsFinished(true); // 計測完了状態にする

    const durationSec = (currentEndTime - startTime) / 1000;
    const durationMin = durationSec / 60;
    const charCount = text.length;
    const cpm = durationMin > 0 ? Math.round(charCount / durationMin) : 0;

    let commentText = "";
    if (cpm === 0 && charCount > 0) {
      commentText = "測定時間が短すぎるか、エラーが発生した可能性があります。";
    } else if (charCount === 0) {
      commentText = "テキストが入力されていませんでした。";
    } else if (cpm <= 300) {
      commentText =
        "ゆっくり着実に読めていますね。\nまずは内容を理解することから始めましょう。";
    } else if (cpm <= 500) {
      commentText =
        "良いペースです。\nJLPT N3～N2レベルの読解に近づいています。\nさらに練習して速度アップを目指しましょう！";
    } else if (cpm <= 700) {
      commentText =
        "素晴らしい読書速度です！\nJLPT N1レベルの読解も視野に入ってきますね。\nより複雑な文章にも対応できるでしょう。";
    } else {
      commentText =
        "非常に速い読書速度です！\nネイティブスピーカーに近いレベルかもしれません。\n素晴らしいです！";
    }

    setResultData({
      time: Math.round(durationSec),
      speed: cpm,
      comment: commentText,
    });
    setIsModalOpen(true);
  };

  const closeModalAndRestart = () => {
    setIsModalOpen(false);
    setIsFinished(false); // 「もう一度」ボタンなので、完了状態も解除
    setText(""); // テキストエリアをクリア
    setResultData(null);
    setStartTime(0);
  };

  // Escキーでモーダルを閉じる
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isModalOpen) {
          closeModalAndRestart();
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isModalOpen]); // isModalOpen を依存配列に追加

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <FixedTitle>速読トレーニング</FixedTitle>

        <TextDisplayArea
          placeholder="ここに文章を貼り付けてください..."
          value={text}
          onChange={handleTextChange}
          readOnly={isReading || isFinished} // 計測中または結果表示待ちの間は読み取り専用
        />

        <ControlsWrapper>
          <ButtonContainer>
            {/* 「もう一度」ボタンはモーダル内に配置するか、モーダルが閉じた後に表示するか検討 */}
            {/* ここでは、メイン画面にはスタート/ストップのみ表示し、リスタートはモーダル経由とする */}
            {!isReading && !isFinished && (
              <StartButton onClick={handleStart} disabled={!text.trim()}>
                スタート
              </StartButton>
            )}
            {isReading && (
              <StopButton onClick={handleStop}>ストップ</StopButton>
            )}
            {/* 結果表示後は、モーダル内のボタンで操作を促す */}
            {isFinished && !isReading && !isModalOpen && (
              // モーダルが閉じた後、再度挑戦できるように「もう一度（スタート）」ボタンを表示するイメージ
              // ただし、状態管理が複雑になるため、今回はモーダル内の閉じるボタン＝リスタートとする
              // もしモーダル外に「もう一度」を置くなら、closeModalAndRestartとは別の関数で isModalOpen のみ false にする
              <StartButton onClick={handleStart} disabled={!text.trim()}>
                もう一度スタート
              </StartButton>
            )}
          </ButtonContainer>
          <Message>
            {isReading && "▶ 計測中…"}
            {isFinished &&
              !isModalOpen &&
              "結果ダイアログを閉じました。もう一度挑戦できます。"}
          </Message>
        </ControlsWrapper>

        {isModalOpen && resultData && (
          <ModalOverlay onClick={closeModalAndRestart}>
            {" "}
            {/* オーバーレイクリックでも閉じる */}
            <ModalContent onClick={(e) => e.stopPropagation()}>
              {" "}
              {/* モーダル内のクリックは伝播させない */}
              <ModalTitle>測定結果</ModalTitle>
              <ModalResultItem>
                読了時間： {resultData.time.toLocaleString()} 秒
              </ModalResultItem>
              <ModalResultItem>
                読了速度： {resultData.speed.toLocaleString()} CPM（文字/分）
              </ModalResultItem>
              <ModalComment>
                {/* コメント内の改行を <br /> に変換 */}
                {resultData.comment.split("\n").map((line, index, arr) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </ModalComment>
              <ModalCloseButton onClick={closeModalAndRestart}>
                閉じてリスタート
              </ModalCloseButton>
            </ModalContent>
          </ModalOverlay>
        )}
      </AppContainer>
    </>
  );
};
