import { Html } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { FilterSvg, RaritiesSvg } from "../../assets/svg";
import "./plotFilter.scss";

export const PlotFilter = ({ setFilters, filters }) => {
  const [filtersActive, setFiltersActive] = useState(false);

  return (
    <Html wrapperClass="plotFilterWrapper">
      <div className="filterContent">
        <div className="filterBtns">
          <button
            className="filterBtn"
            onClick={() => setFiltersActive(!filtersActive)}
          >
            <FilterSvg /> Filters
          </button>
          <button className="rarityBtn">
            <RaritiesSvg />
          </button>
        </div>
        {filtersActive && (
          <div className="filtersModal">
            <div className="size">
              <p>Size</p>
              <div className="buttonSelect">
                <button
                  className={filters === "All" ? "active" : ""}
                  onClick={(e) => setFilters(e.target.textContent)}
                >
                  All
                </button>
                <button
                  className={filters === "Small" ? "active" : ""}
                  onClick={(e) => setFilters(e.target.textContent)}
                >
                  Small
                </button>
                <button
                  className={filters === "Medium" ? "active" : ""}
                  onClick={(e) => setFilters(e.target.textContent)}
                >
                  Medium
                </button>
                <button
                  className={filters === "Large" ? "active" : ""}
                  onClick={(e) => setFilters(e.target.textContent)}
                >
                  Large
                </button>
              </div>
            </div>
            <div className="availability">
              <p>Availability</p>
              <div className="buttonSelect">
                <button className="active">All</button>
                <button>Sold</button>
                <button>Available</button>
              </div>
            </div>
          </div>
        )}
        <div className="raritiesModal">
          {/* <span>Size</span>
          <span>Availability</span> */}
        </div>
      </div>
    </Html>
  );
};
