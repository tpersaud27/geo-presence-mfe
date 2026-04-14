import { useEffect, useState } from "react";
import type {
  GeoPresenceConfig,
  GeoPresenceMode,
} from "../../core/config/geoPresenceConfig";
import type { PresenceUser } from "../../core/models/presenceUser";
import type { VisibilityFilter } from "../../core/models/visibilityFilter";
import type { MapSearchTarget } from "../../core/models/mapSearchTarget";
import {
  countMatchedUsers,
  countUsersByVisibility,
  filterUsersByVisibility,
} from "../../utils/presenceUserUtils";
import {
  searchPlaceByName,
  searchPlaceSuggestions,
} from "../../utils/geocodingUtils";
import SelectedUserDetails from "../../components/SelectedUserDetails";
import PresenceUserList from "../../components/PresenceUserList";
import GeoPresenceRendererPanel from "../../components/GeoPresenceRendererPanel";
import GeoPresenceControls from "../../components/GeoPresenceControls";
import GeoPresenceSummary from "../../components/GeoPresenceSummary";

interface GeoPresenceDashboardProps {
  config: GeoPresenceConfig;
  users: PresenceUser[];
}

function GeoPresenceDashboard({ config, users }: GeoPresenceDashboardProps) {
  const {
    mode: configuredMode = "2d",
    enableModeToggle = false,
    initialView,
    providers,
  } = config;

  const [currentMode, setCurrentMode] =
    useState<GeoPresenceMode>(configuredMode);
  const [selectedUser, setSelectedUser] = useState<PresenceUser | null>(null);
  const [visibilityFilter, setVisibilityFilter] =
    useState<VisibilityFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [placeSearchTerm, setPlaceSearchTerm] = useState("");
  const [placeSuggestions, setPlaceSuggestions] = useState<MapSearchTarget[]>(
    [],
  );
  const [activePlaceSuggestionIndex, setActivePlaceSuggestionIndex] =
    useState(-1);
  const [mapSearchTarget, setMapSearchTarget] =
    useState<MapSearchTarget | null>(null);
  const [isPlaceSearchLoading, setIsPlaceSearchLoading] = useState(false);
  const [placeSearchError, setPlaceSearchError] = useState<string | null>(null);
  const [placeSearchMessage, setPlaceSearchMessage] = useState<string | null>(
    null,
  );
  const [showMatchedOnly, setShowMatchedOnly] = useState(false);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [autoScrollToSelectedUser, setAutoScrollToSelectedUser] =
    useState(true);

  const totalUserCount = users.length;
  const publicUserCount = countUsersByVisibility(users, "public");
  const matchesOnlyUserCount = countUsersByVisibility(users, "matches-only");
  const hiddenUserCount = countUsersByVisibility(users, "hidden");
  const matchedUserCount = countMatchedUsers(users);

  const visibilityFilteredUsers = filterUsersByVisibility(
    users,
    visibilityFilter,
  );

  const matchedFilteredUsers = showMatchedOnly
    ? visibilityFilteredUsers.filter((user) => user.isMatch)
    : visibilityFilteredUsers;

  const onlineFilteredUsers = showOnlineOnly
    ? matchedFilteredUsers.filter((user) => user.status === "online")
    : matchedFilteredUsers;

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredUsers = normalizedSearchTerm
    ? onlineFilteredUsers.filter((user) =>
        user.displayName.toLowerCase().includes(normalizedSearchTerm),
      )
    : onlineFilteredUsers;

  const initialLatitude = initialView?.lat ?? 39.5;
  const initialLongitude = initialView?.lon ?? -98.35;
  const initialZoom = initialView?.zoom ?? 3;
  const tileUrlTemplate = providers.map2d.tileUrlTemplate;
  const geocodingSearchUrl = providers.geocoding?.searchUrl;

  useEffect(() => {
    if (!selectedUser) {
      return;
    }

    const selectedUserStillVisible = filteredUsers.some(
      (user) => user.id === selectedUser.id,
    );

    if (!selectedUserStillVisible) {
      setSelectedUser(null);
    }
  }, [filteredUsers, selectedUser]);

  useEffect(() => {
    if (!geocodingSearchUrl) {
      return;
    }

    const trimmed = placeSearchTerm.trim();

    if (trimmed.length < 2) {
      setPlaceSuggestions([]);
      setActivePlaceSuggestionIndex(-1);
      setPlaceSearchError(null);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        const suggestions = await searchPlaceSuggestions(
          geocodingSearchUrl,
          trimmed,
        );
        setPlaceSuggestions(suggestions);
        setActivePlaceSuggestionIndex(-1);
        setPlaceSearchError(null);
      } catch (error) {
        console.error("Place suggestion search failed", error);
        setPlaceSuggestions([]);
        setActivePlaceSuggestionIndex(-1);
        setPlaceSearchError("Unable to load location suggestions right now.");
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [placeSearchTerm, geocodingSearchUrl]);

  const handleModeToggle = () => {
    setCurrentMode((previousMode) => (previousMode === "2d" ? "3d" : "2d"));
  };

  const handleUserSelect = (user: PresenceUser) => {
    setSelectedUser(user);
    setMapSearchTarget(null);
    setPlaceSearchMessage(null);
  };

  const handleVisibilityFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setVisibilityFilter(event.target.value as VisibilityFilter);
  };

  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handlePlaceSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPlaceSearchTerm(event.target.value);
    setPlaceSearchMessage(null);
    setPlaceSearchError(null);
  };

  const handleSubmitPlaceSearch = async () => {
    if (!geocodingSearchUrl) {
      setPlaceSearchError("Location search is not configured.");
      return;
    }

    try {
      setIsPlaceSearchLoading(true);
      setPlaceSearchError(null);
      setPlaceSearchMessage(null);

      const result = await searchPlaceByName(
        geocodingSearchUrl,
        placeSearchTerm,
      );

      if (!result) {
        setMapSearchTarget(null);
        setPlaceSearchMessage("No matching location was found.");
        return;
      }

      setMapSearchTarget(result);
      setSelectedUser(null);
      setPlaceSuggestions([]);
      setActivePlaceSuggestionIndex(-1);
      setPlaceSearchMessage(`Showing map results for ${result.label}`);
    } catch (error) {
      console.error("Place search failed", error);
      setPlaceSearchError("Location search failed. Please try again.");
    } finally {
      setIsPlaceSearchLoading(false);
    }
  };

  const handleClearPlaceSearch = () => {
    setPlaceSearchTerm("");
    setPlaceSuggestions([]);
    setActivePlaceSuggestionIndex(-1);
    setMapSearchTarget(null);
    setPlaceSearchError(null);
    setPlaceSearchMessage(null);
  };

  const handleSelectPlaceSuggestion = (target: MapSearchTarget) => {
    setPlaceSearchTerm(target.label);
    setPlaceSuggestions([]);
    setActivePlaceSuggestionIndex(-1);
    setMapSearchTarget(target);
    setSelectedUser(null);
    setPlaceSearchError(null);
    setPlaceSearchMessage(`Showing map results for ${target.label}`);
  };

  const handlePlaceSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!placeSuggestions.length) {
        return;
      }

      setActivePlaceSuggestionIndex((previousIndex) =>
        previousIndex < placeSuggestions.length - 1
          ? previousIndex + 1
          : previousIndex,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!placeSuggestions.length) {
        return;
      }

      setActivePlaceSuggestionIndex((previousIndex) =>
        previousIndex > 0 ? previousIndex - 1 : 0,
      );
      return;
    }

    if (event.key === "Escape") {
      setPlaceSuggestions([]);
      setActivePlaceSuggestionIndex(-1);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (
        activePlaceSuggestionIndex >= 0 &&
        activePlaceSuggestionIndex < placeSuggestions.length
      ) {
        handleSelectPlaceSuggestion(
          placeSuggestions[activePlaceSuggestionIndex],
        );
        return;
      }

      void handleSubmitPlaceSearch();
    }
  };

  const handleShowMatchedOnlyChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setShowMatchedOnly(event.target.checked);
  };

  const handleShowOnlineOnlyChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setShowOnlineOnly(event.target.checked);
  };

  const handleAutoScrollToSelectedUserChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setAutoScrollToSelectedUser(event.target.checked);
  };

  return (
    <main className="app">
      <section className="app__header">
        <h1>geo-presence-mfe</h1>
        <p>Foundation setup in progress.</p>
      </section>

      <section className="app__main-content">
        <div className="app__renderer-column">
          <GeoPresenceControls
            currentMode={currentMode}
            enableModeToggle={enableModeToggle}
            visibilityFilter={visibilityFilter}
            searchTerm={searchTerm}
            placeSearchTerm={placeSearchTerm}
            placeSuggestions={placeSuggestions}
            activePlaceSuggestionIndex={activePlaceSuggestionIndex}
            placeSearchError={placeSearchError}
            placeSearchMessage={placeSearchMessage}
            showMatchedOnly={showMatchedOnly}
            showOnlineOnly={showOnlineOnly}
            autoScrollToSelectedUser={autoScrollToSelectedUser}
            isPlaceSearchLoading={isPlaceSearchLoading}
            onModeToggle={handleModeToggle}
            onVisibilityFilterChange={handleVisibilityFilterChange}
            onSearchTermChange={handleSearchTermChange}
            onClearSearch={handleClearSearch}
            onPlaceSearchTermChange={handlePlaceSearchTermChange}
            onPlaceSearchKeyDown={handlePlaceSearchKeyDown}
            onSubmitPlaceSearch={handleSubmitPlaceSearch}
            onClearPlaceSearch={handleClearPlaceSearch}
            onSelectPlaceSuggestion={handleSelectPlaceSuggestion}
            onShowMatchedOnlyChange={handleShowMatchedOnlyChange}
            onShowOnlineOnlyChange={handleShowOnlineOnlyChange}
            onAutoScrollToSelectedUserChange={
              handleAutoScrollToSelectedUserChange
            }
          />

          <GeoPresenceRendererPanel
            mode={currentMode}
            users={filteredUsers}
            selectedUser={selectedUser}
            tileUrlTemplate={tileUrlTemplate}
            initialLatitude={initialLatitude}
            initialLongitude={initialLongitude}
            initialZoom={initialZoom}
            mapSearchTarget={mapSearchTarget}
            onClearMapSearchTarget={handleClearPlaceSearch}
            onUserSelect={handleUserSelect}
          />
        </div>

        <div className="app__details-column">
          <GeoPresenceSummary
            configuredMode={configuredMode}
            currentMode={currentMode}
            initialLatitude={initialLatitude}
            initialLongitude={initialLongitude}
            initialZoom={initialZoom}
            totalUserCount={totalUserCount}
            publicUserCount={publicUserCount}
            matchesOnlyUserCount={matchesOnlyUserCount}
            hiddenUserCount={hiddenUserCount}
            matchedUserCount={matchedUserCount}
            visibilityFilter={visibilityFilter}
            filteredUserCount={filteredUsers.length}
            selectedUserName={selectedUser?.displayName}
            searchTerm={searchTerm}
            activePlaceSearchLabel={mapSearchTarget?.label}
            showMatchedOnly={showMatchedOnly}
            showOnlineOnly={showOnlineOnly}
            autoScrollToSelectedUser={autoScrollToSelectedUser}
          />

          <SelectedUserDetails selectedUser={selectedUser} />
        </div>
      </section>

      <PresenceUserList
        users={filteredUsers}
        selectedUser={selectedUser}
        onUserSelect={handleUserSelect}
        autoScrollToSelectedUser={autoScrollToSelectedUser}
      />
    </main>
  );
}

export default GeoPresenceDashboard;
