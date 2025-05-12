import React, { useState } from "react";
import styled from "styled-components";
import { GlobalStyle } from "./styles/GlobalStyle";

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
    background-color: #efefef;
    color: #555;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const ControlsAndResultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%; // ラッパーが幅を持つように
`;

// ボタンと「計測中」メッセージのためのエリア
const ActionArea = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* min-height を削除 */
`;

const ButtonContainer = styled.div`
  margin-bottom: 10px; // 「計測中」メッセージとの間隔
`;

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 15px; // 下に続く要素がない場合は不要になる可能性もある
`;

const ResultsArea = styled.div`
  padding: 15px;
  background-color: #f0f8ff;
  border-radius: 8px;
  margin-bottom: 15px; // リスタートボタンとのマージン
  width: 100%;
  box-sizing: border-box;
`;

const ResultItem = styled.p`
  font-size: 18px;
  color: #333;
  margin: 8px 0;
`;

const Message = styled.p`
  font-size: 16px;
  color: #555;
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

const RestartButton = styled(BaseButton)`
  background-color: #007bff;
  color: white;
  /* margin-top: 0; // ActionArea や ResultsContainer の margin で制御するため、個別マージンは不要 */
  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
`;

// --- App Component ---

export const App: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [isReading, setIsReading] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0);

  const [readingTimeSec, setReadingTimeSec] = useState<number>(0);
  const [readingSpeedCPM, setReadingSpeedCPM] = useState<number>(0);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isReading || isFinished) return;
    setText(event.target.value);
  };

  const handleStart = () => {
    if (!text.trim()) return;
    setStartTime(Date.now());
    setIsReading(true);
    setIsFinished(false);
    setReadingTimeSec(0);
    setReadingSpeedCPM(0);
  };

  const handleStop = () => {
    const currentEndTime = Date.now();
    setIsReading(false);
    setIsFinished(true);

    const durationSec = (currentEndTime - startTime) / 1000;
    const durationMin = durationSec / 60;
    const charCount = text.length;
    const cpm = durationMin > 0 ? Math.round(charCount / durationMin) : 0;

    setReadingTimeSec(Math.round(durationSec));
    setReadingSpeedCPM(cpm);
  };

  const handleRestart = () => {
    setText("");
    setIsReading(false);
    setIsFinished(false);
    setStartTime(0);
    setReadingTimeSec(0);
    setReadingSpeedCPM(0);
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <FixedTitle>速読トレーニング</FixedTitle>

        <TextDisplayArea
          placeholder="ここに文章を貼り付けてください..."
          value={text}
          onChange={handleTextChange}
          readOnly={isReading || isFinished}
        />

        <ControlsAndResultsWrapper>
          {/* スタート・ストップボタンと計測中メッセージ */}
          {!isFinished && ( // 計測終了時はこのエリア全体を非表示
            <ActionArea>
              <ButtonContainer>
                {!isReading ? (
                  <StartButton onClick={handleStart} disabled={!text.trim()}>
                    スタート
                  </StartButton>
                ) : (
                  <StopButton onClick={handleStop}>ストップ</StopButton>
                )}
              </ButtonContainer>
              {isReading && <Message>▶ 計測中…</Message>}
            </ActionArea>
          )}

          {/* 結果表示とリスタートボタン */}
          {isFinished && (
            <ResultsContainer>
              <ResultsArea>
                <ResultItem>読了時間：{readingTimeSec} 秒</ResultItem>
                <ResultItem>
                  読了速度：{readingSpeedCPM.toLocaleString()} CPM（文字/分）
                </ResultItem>
              </ResultsArea>
              <RestartButton onClick={handleRestart}>もう一度</RestartButton>
            </ResultsContainer>
          )}
        </ControlsAndResultsWrapper>
      </AppContainer>
    </>
  );
};
