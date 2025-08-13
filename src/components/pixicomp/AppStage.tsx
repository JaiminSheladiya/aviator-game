import {
  AnimatedSprite,
  Container,
  Graphics,
  Sprite,
  Text,
  useTick,
} from "@pixi/react";
import {
  TextStyle,
  Texture,
  Graphics as GraphicsRaw,
  ColorMatrixFilter,
} from "pixi.js";
import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import {
  renderCurve as _renderCurve,
  createGradTexture,
  curveFunction,
  maskDraw as _drawMask,
  smoothen,
  _drawOuterBoundery,
  _drawInnerBoundery,
  interpolate,
} from "../../utils";
import { dimensionType, gameAnimStatusType } from "../../@types";
import type { Container as ContainerType } from "pixi.js";
import { GameStages } from "../../providers/SocketProvider";

const AppStage = ({
  payout,
  game_anim_status,
  dimension,
  pixiDimension,
}: {
  payout: number;
  game_anim_status: GameStages;
  dimension: dimensionType;
  pixiDimension: dimensionType;
}) => {
  const tickRef = useRef(0);
  const hueRotateRef = useRef(0);
  const pulseGraphRef = useRef(0);
  const crashOffset = useRef(0);
  const planeXRef = useRef(0);
  const posPlaneRef = useRef({ x: 0, y: 0 });
  const [planeScale, setPlaneScale] = useState(0.2);
  const [pulseBase, setPulseBase] = useState(0.8);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<ContainerType>(null);

  useTick((delta) => {
    if (game_anim_status === GameStages.RUN && containerRef.current) {
      containerRef.current.rotation += 0.003 * delta;
    }
  });

  const renderCurve = useCallback(
    (g: GraphicsRaw) => _renderCurve(g, dimension),
    [dimension]
  );
  const drawOuterBoundery = useCallback(
    (g: GraphicsRaw) => _drawOuterBoundery(g, dimension),
    [dimension]
  );
  const drawInnerBoundery = useCallback(
    (g: GraphicsRaw) => _drawInnerBoundery(g, dimension),
    [dimension]
  );

  const gradTexture = useMemo(() => createGradTexture(dimension), [dimension]);

  const handleResize = () => {
    const mobileStatus = window.innerWidth < 768;
    setIsMobile(mobileStatus);

    // Increase plane scale for mobile devices
    if (mobileStatus) {
      setPlaneScale(0.6); // Larger scale for mobile
    } else if (window.innerWidth < 1024) {
      setPlaneScale(0.4); // Medium scale for tablet
    } else {
      setPlaneScale(0.4); // Original scale for desktop
    }

    setPulseBase(interpolate(window.innerWidth, 400, 1920, 0.6, 0.8));
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dimension]);

  useEffect(() => {
    if (game_anim_status === GameStages.WAIT) {
      tickRef.current = 0;
      crashOffset.current = 0;
      planeXRef.current = 0;
      posPlaneRef.current = {
        x: interpolate(dimension.width, 400, 1920, 10, 5),
        y: dimension.height,
      };
      crashOffset.current = 0;
    }
  }, [game_anim_status, dimension]);

  useTick((delta) => {
    hueRotateRef.current += delta / 500;

    if (game_anim_status === GameStages.RUN) {
      tickRef.current += delta * 0.02;

      const amp = 0.06;
      pulseGraphRef.current = Math.sin(tickRef.current) * amp;

      const rawX = tickRef.current * 300;
      const smoothedX = smoothen(Math.min(rawX, dimension.width - 40), {
        width: dimension.width - 40,
        height: dimension.height - 40,
      });
      planeXRef.current = smoothedX;
    }

    if (game_anim_status === GameStages.BLAST) {
      crashOffset.current += delta * 8; // Increased from 4 to 8 for faster blast
    }

    const crashX =
      game_anim_status === GameStages.BLAST ? crashOffset.current * 8 : 0; // Increased from 4 to 8
    const crashY =
      game_anim_status === GameStages.BLAST ? crashOffset.current * 3 : 0; // Increased from 1.5 to 3

    posPlaneRef.current = {
      x:
        (pulseBase + pulseGraphRef.current) * planeXRef.current +
        crashX +
        interpolate(dimension.width, 400, 1920, 10, 5),
      y:
        dimension.height -
        interpolate(dimension.width, 400, 1920, 15, 60) -
        (1 - pulseGraphRef.current) *
          curveFunction(planeXRef.current, {
            width: dimension.width - 40,
            height: dimension.height - 40,
          }) -
        crashY,
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % 9);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const colorMatrix = useMemo(() => {
    const c = new ColorMatrixFilter();
    c.hue(hueRotateRef.current * 100, true);
    return c;
  }, [hueRotateRef.current]);

  const maskRef = useRef<GraphicsRaw>(null);
  const dotRef = useRef<GraphicsRaw>(null);
  const gameBoardMask = useRef<GraphicsRaw>(null);

  const curveMask = useCallback(
    (g: GraphicsRaw) =>
      _drawMask(g, {
        width: dimension.width - 40,
        height: dimension.height - 40,
      }),
    [dimension]
  );

  const dotLeftBottom = useCallback(
    (g: GraphicsRaw) => _drawMask(g, { width: 1, height: 1 }),
    []
  );

  const planeFrames = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) =>
        Texture.from(`/plane/plane-${i + 1}.png`)
      ),
    []
  );

  // const drawRadialSlices = (g: GraphicsRaw) => {
  //   g.clear();
  //   const centerX = 0;
  //   const centerY = dimension.height;
  //   const totalSlices = 60;
  //   const radius = Math.max(dimension.width, dimension.height) * 2;
  //   for (let i = 0; i < totalSlices; i++) {
  //     const startAngle = (i / totalSlices) * Math.PI * 2;
  //     const endAngle = ((i + 1) / totalSlices) * Math.PI * 2;
  //     g.beginFill(i % 2 === 0 ? 0x0a0a0a : 0x121212);
  //     g.moveTo(centerX, centerY);
  //     g.arc(centerX, centerY, radius, startAngle, endAngle);
  //     g.lineTo(centerX, centerY);
  //     g.endFill();
  //   }
  // };

  const drawRadialSlices = (g: GraphicsRaw) => {
    g.clear();
    const centerX = 0;
    const centerY = 0; // Note: it's 0 because the container is already placed at bottom-left
    const totalSlices = 60;
    const radius = Math.max(dimension.width, dimension.height) * 2;

    for (let i = 0; i < totalSlices; i++) {
      const startAngle = (i / totalSlices) * Math.PI * 2;
      const endAngle = ((i + 1) / totalSlices) * Math.PI * 2;
      g.beginFill(i % 2 === 0 ? 0x0a0a0a : 0x121212);
      g.moveTo(centerX, centerY);
      g.arc(centerX, centerY, radius, startAngle, endAngle);
      g.lineTo(centerX, centerY);
      g.endFill();
    }
  };

  return (
    <Container>
      {/* <Graphics draw={drawRadialSlices} /> */}
      {/* <Graphics
        ref={graphicsRef}
        draw={drawRadialSlices}
        x={dimension.width / 2}
        y={dimension.height / 2}
      /> */}

      <Container
        ref={containerRef}
        x={0}
        y={dimension.height}
        pivot={{ x: 0, y: 0 }}
      >
        <Graphics draw={drawRadialSlices} />
      </Container>
      {game_anim_status === GameStages.RUN ? (
        <Sprite
          filters={[colorMatrix]}
          texture={gradTexture}
          width={dimension.width}
          height={dimension.height}
          position={{ x: 0, y: 0 }}
        />
      ) : null}
      <Graphics
        draw={(g) => {
          g.clear();
          g.beginFill(0xffd700, 0.3);
          g.drawCircle(0, 0, 100);
          g.endFill();
        }}
        x={-100}
        y={dimension.height + 100}
      />
      <Graphics
        ref={gameBoardMask}
        draw={dotLeftBottom}
        x={40}
        scale={{ x: dimension.width - 40, y: dimension.height - 40 }}
      />
      <Container
        mask={gameBoardMask.current}
        visible={game_anim_status === GameStages.RUN}
        position={{ x: 0, y: 0 }}
      >
        <Graphics
          mask={maskRef.current}
          draw={renderCurve}
          position={{ x: 0, y: dimension.height }}
          scale={{
            x: pulseBase + pulseGraphRef.current,
            y: 1 - pulseGraphRef.current,
          }}
          pivot={{ x: 0, y: dimension.height }}
        />
        <Graphics
          scale={{
            x:
              ((pulseBase + pulseGraphRef.current) * planeXRef.current) /
              (dimension.width - 40),
            y: 1,
          }}
          name="mask"
          draw={curveMask}
          ref={maskRef}
        />
      </Container>
      <Container>
        <Sprite
          texture={planeFrames[currentFrame]}
          pivot={{ x: 0.08, y: 0.54 }}
          anchor={{ x: 0.07, y: 0.55 }}
          scale={planeScale}
          position={{ x: posPlaneRef.current.x, y: posPlaneRef.current.y - 50 }}
        />
        <Text
          visible={game_anim_status === GameStages.RUN}
          text={payout + "x"}
          anchor={0.5}
          x={dimension.width / 2}
          y={dimension.height / 2}
          style={
            new TextStyle({
              align: "center",
              fontFamily: "Roboto",
              fontSize: isMobile ? 350 : 150,
              fontWeight: "700",
              fill: ["#ffffff", "#ffffff"],
              stroke: "#111111",
              strokeThickness: 2,
              dropShadow: false,
            })
          }
        />
      </Container>
      {/* <Graphics draw={drawInnerBoundery} />
      <Container ref={dotRef}>
        <Graphics
          draw={dotLeftBottom}
          scale={{ x: 40, y: dimension.height - 40 }}
        />
        <Graphics
          position={{ x: 40, y: dimension.height - 40 }}
          scale={{ x: dimension.width - 40, y: 40 }}
          draw={dotLeftBottom}
        />
      </Container>
      <Container mask={dotRef.current}>
        {Array.from(
          { length: 20 },
          (_, i) => (i * 140000) / pixiDimension.width + 10
        ).map((coor, i) => (
          <Container key={i}>
            <Graphics
              draw={(g) => {
                g.clear();
                g.beginFill(0xffffff, 0.6);
                g.drawCircle(0, 0, 3);
                g.endFill();
              }}
              anchor={0.5}
              x={20}
              y={
                coor +
                ((hueRotateRef.current * 400) %
                  (140000 / pixiDimension.width)) -
                100
              }
            />
            <Graphics
              draw={(g) => {
                g.clear();
                g.beginFill(0xffffff, 0.6);
                g.drawCircle(0, 0, 3);
                g.endFill();
              }}
              anchor={0.5}
              x={
                coor -
                ((hueRotateRef.current * 400) %
                  (140000 / pixiDimension.width)) -
                100
              }
              y={dimension.height - 20}
            />
          </Container>
        ))}
      </Container>
      <Graphics draw={drawOuterBoundery} /> */}
    </Container>
  );
};

export default AppStage;
