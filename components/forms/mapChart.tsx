import React, { useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am4geodata_continentsLow from "@amcharts/amcharts4-geodata/continentsLow";
import { GeoJSON } from "geojson";

console.log("am5map:", am5map);


const MapChart: React.FC = () => {
  useEffect(() => {
    // Ensure the chart div exists
    const chartDiv = document.getElementById("chartdiv");
    if (!chartDiv) {
      console.error('Element with id "chartdiv" not found in the DOM.');
      return;
    }

    // Initialize root
    const root = am5.Root.new("chartdiv");

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    try {
      // Create map
      const map = root.container.children.push(
        am5map.MapChart.new(root, {
          panX: "none",
          projection: am5map.geoNaturalEarth1(),
        })
      );

      // Create polygon series
      const polygonSeries = map.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am4geodata_continentsLow as unknown as GeoJSON,
          exclude: ["antarctica"],
          fill: am5.color(0xbbbbbb),
        })
      );

      // Create point series
      const pointSeries = map.series.push(am5map.MapPointSeries.new(root, {}));
      const colorSet = am5.ColorSet.new(root, { step: 2 });

      // Add bullets
      pointSeries.bullets.push((root, series, dataItem) => {
        const value = (dataItem.dataContext as { value: number }).value;

        const container = am5.Container.new(root, {});
        const color = colorSet.next();
        const radius = 15 + (value / 20) * 20;

        container.children.push(
          am5.Circle.new(root, {
            radius,
            fill: color,
            dy: -radius * 2,
          })
        );

        container.children.push(
          am5.Line.new(root, {
            stroke: color,
            height: -40,
            strokeGradient: am5.LinearGradient.new(root, {
              stops: [
                { opacity: 1 },
                { opacity: 1 },
                { opacity: 0 },
              ],
            }),
          })
        );

        container.children.push(
          am5.Label.new(root, {
            text: `${value}%`,
            fill: am5.color(0xffffff),
            fontWeight: "400",
            centerX: am5.p50,
            centerY: am5.p50,
            dy: -radius * 2,
          })
        );

        container.children.push(
          am5.Label.new(root, {
            text: (dataItem.dataContext as { title: string }).title,
            fill: color,
            fontWeight: "500",
            fontSize: "1em",
            centerY: am5.p50,
            dy: -radius * 2,
            dx: radius,
          })
        );

        return am5.Bullet.new(root, {
          sprite: container,
        });
      });

      // Add data
      const data = [
        { title: "United States", latitude: 40.7128, longitude: -74.0060, value: 17 },
        { title: "Kosovo", latitude: 42.6629, longitude: 21.1655, value: 7 },
        { title: "Switzerland", latitude: 46.8182, longitude: 8.2275, value: 14 },
      ];

      data.forEach((item) => {
        pointSeries.data.push({
          geometry: { type: "Point", coordinates: [item.longitude, item.latitude] },
          title: item.title,
          value: item.value,
        });
      });
    } catch (error) {
      console.error("Error creating map chart:", error);
    }

    return () => {
      // Dispose of root to avoid memory leaks
      root.dispose();
    };
  }, []);

  return <div id="chartdiv" style={{ width: "100%", height: "500px" }} />;
};

export default MapChart;