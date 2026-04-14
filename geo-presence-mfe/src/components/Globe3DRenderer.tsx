import { useEffect, useRef } from "react";
import {
  Cartesian2,
  Cartesian3,
  Color,
  ImageryLayer,
  LabelStyle,
  Math as CesiumMath,
  SceneMode,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  UrlTemplateImageryProvider,
  Viewer,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import type { PresenceUser } from "../core/models/presenceUser";
import type { MapSearchTarget } from "../core/models/mapSearchTarget";

if (typeof window !== "undefined") {
  (window as Window & { CESIUM_BASE_URL?: string }).CESIUM_BASE_URL =
    "/node_modules/cesium/Build/Cesium/";
}

interface Globe3DRendererProps {
  tileUrlTemplate?: string;
  initialLatitude: number;
  initialLongitude: number;
  initialZoom: number;
  users: PresenceUser[];
  selectedUser: PresenceUser | null;
  mapSearchTarget: MapSearchTarget | null;
  onUserSelect: (user: PresenceUser) => void;
}

function Globe3DRenderer({
  tileUrlTemplate,
  initialLatitude,
  initialLongitude,
  initialZoom,
  users,
  selectedUser,
  mapSearchTarget,
  onUserSelect,
}: Globe3DRendererProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const clickHandlerRef = useRef<ScreenSpaceEventHandler | null>(null);

  const defaultPitch = CesiumMath.toRadians(-35);
  const defaultHeading = 0;
  const defaultRoll = 0;

  const initialHeight = Math.max(2800000, 18000000 / Math.max(initialZoom, 1));
  const placeSearchHeight = 1800000;
  const selectedUserHeight = 1200000;

  useEffect(() => {
    if (!containerRef.current || viewerRef.current || !tileUrlTemplate) {
      return;
    }

    const viewer = new Viewer(containerRef.current, {
      baseLayer: false,
      animation: false,
      timeline: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      infoBox: false,
      selectionIndicator: false,
      sceneMode: SceneMode.SCENE3D,
    });

    viewer.scene.globe.baseColor = Color.BLACK;
    viewer.scene.globe.enableLighting = true;

    const imageryProvider = new UrlTemplateImageryProvider({
      url: tileUrlTemplate,
      credit: "© OpenStreetMap contributors",
    });

    viewer.imageryLayers.add(new ImageryLayer(imageryProvider));

    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(
        initialLongitude,
        initialLatitude,
        initialHeight,
      ),
      orientation: {
        heading: defaultHeading,
        pitch: defaultPitch,
        roll: defaultRoll,
      },
    });

    viewerRef.current = viewer;

    setTimeout(() => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.resize();
      }
    }, 0);

    return () => {
      if (clickHandlerRef.current) {
        clickHandlerRef.current.destroy();
        clickHandlerRef.current = null;
      }

      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [
    tileUrlTemplate,
    initialLatitude,
    initialLongitude,
    initialZoom,
    initialHeight,
    defaultPitch,
  ]);

  useEffect(() => {
    const viewer = viewerRef.current;

    if (!viewer || viewer.isDestroyed()) {
      return;
    }

    viewer.resize();
  }, [users, selectedUser, mapSearchTarget]);

  useEffect(() => {
    const viewer = viewerRef.current;

    if (!viewer) {
      return;
    }

    viewer.entities.removeAll();

    users.forEach((user) => {
      const isSelected = selectedUser?.id === user.id;

      viewer.entities.add({
        id: user.id,
        position: Cartesian3.fromDegrees(
          user.coordinates.lon,
          user.coordinates.lat,
        ),
        point: {
          pixelSize: isSelected ? 14 : 10,
          color: isSelected ? Color.ORANGE : Color.DODGERBLUE,
          outlineColor: Color.WHITE,
          outlineWidth: 2,
        },
        label: {
          text: user.displayName,
          font: "12px sans-serif",
          fillColor: Color.WHITE,
          outlineColor: Color.BLACK,
          outlineWidth: 2,
          style: LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cartesian2(0, -24),
          show: isSelected,
        },
      });
    });
  }, [users, selectedUser]);

  useEffect(() => {
    const viewer = viewerRef.current;

    if (!viewer || !viewer.scene.canvas) {
      return;
    }

    if (clickHandlerRef.current) {
      clickHandlerRef.current.destroy();
      clickHandlerRef.current = null;
    }

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction((movement: { position: Cartesian2 }) => {
      const pickedObject = viewer.scene.pick(movement.position);

      if (!pickedObject || !pickedObject.id) {
        return;
      }

      const pickedEntityId =
        typeof pickedObject.id.id === "string"
          ? pickedObject.id.id
          : pickedObject.id;

      const matchedUser = users.find((user) => user.id === pickedEntityId);

      if (matchedUser) {
        onUserSelect(matchedUser);
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    clickHandlerRef.current = handler;

    return () => {
      if (clickHandlerRef.current) {
        clickHandlerRef.current.destroy();
        clickHandlerRef.current = null;
      }
    };
  }, [users, onUserSelect]);

  useEffect(() => {
    const viewer = viewerRef.current;

    if (!viewer) {
      return;
    }

    if (mapSearchTarget) {
      viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(
          mapSearchTarget.lon,
          mapSearchTarget.lat,
          placeSearchHeight,
        ),
        orientation: {
          heading: defaultHeading,
          pitch: defaultPitch,
          roll: defaultRoll,
        },
        duration: 1.2,
      });
      return;
    }

    if (selectedUser) {
      viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(
          selectedUser.coordinates.lon,
          selectedUser.coordinates.lat,
          selectedUserHeight,
        ),
        orientation: {
          heading: defaultHeading,
          pitch: defaultPitch,
          roll: defaultRoll,
        },
        duration: 1.2,
      });
      return;
    }

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(
        initialLongitude,
        initialLatitude,
        initialHeight,
      ),
      orientation: {
        heading: defaultHeading,
        pitch: defaultPitch,
        roll: defaultRoll,
      },
      duration: 1.2,
    });
  }, [
    mapSearchTarget,
    selectedUser,
    initialLatitude,
    initialLongitude,
    initialHeight,
    defaultPitch,
    placeSearchHeight,
    selectedUserHeight,
  ]);

  if (!tileUrlTemplate) {
    return null;
  }

  return <div ref={containerRef} className="app__globe-container" />;
}

export default Globe3DRenderer;
