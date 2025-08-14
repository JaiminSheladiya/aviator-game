import { Stage, Container } from "@pixi/react";
import { useState, useEffect } from "react";
import { dimensionType } from "../../@types";
import AppStage from "./AppStage";
import { useAviator } from "../../store/aviator";
import { GameStages, useSocket } from "../../providers/SocketProvider";

const PIXIComponent = ({
  pixiDimension,
  curPayout,
  trigParachute,
}: {
  pixiDimension: dimensionType;
  curPayout: number;
  trigParachute: { uniqId: number; isMe: boolean };
}) => {
  const { aviatorState } = useAviator();
  const { gameData } = useSocket();
  const [scale, setScale] = useState(0);
  useEffect(() => {
    setScale(
      Math.min(
        pixiDimension.width / aviatorState.dimension.width,
        pixiDimension.height / aviatorState.dimension.height
      )
    );
  }, [pixiDimension, aviatorState.dimension]);
  return (
    <div className="rounded-b-[1rem] overflow-hidden">
      <Stage
        width={pixiDimension.width}
        height={pixiDimension.height}
        options={{ antialias: true }}
      >
        <Container scale={scale}>
          <AppStage
            payout={curPayout}
            game_anim_status={gameData.status || GameStages.WAIT}
            dimension={aviatorState.dimension}
            pixiDimension={pixiDimension}
            // trigParachute={trigParachute}
          />
        </Container>
      </Stage>
    </div>
  );
};
export default PIXIComponent;
