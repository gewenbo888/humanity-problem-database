"use client";

import { PLATFORM_BY_ID } from "@/data/spec";
import { PLATFORM_ID } from "@/data/self";
import Tree from "./interactive/Tree";
import Database from "./interactive/Database";
import Simulator from "./interactive/Simulator";
import Agents from "./interactive/Agents";
import Graph from "./interactive/Graph";
import Matrix from "./interactive/Matrix";
import Memorial from "./interactive/Memorial";
import Compression from "./interactive/Compression";
import Memory from "./interactive/Memory";

export default function Interactive() {
  const self = PLATFORM_BY_ID[PLATFORM_ID];
  const data = self.sampleData;

  switch (self.interactiveKind) {
    case "tree":        return <Tree        data={data} hue={self.hue} />;
    case "database":
      // how-the-world-works has 'systems' key, humanity-problem-database has 'problems' key
      return <Database data={data} hue={self.hue} kind={"systems" in data ? "systems" : "problems"} />;
    case "simulator":   return <Simulator   data={data} hue={self.hue} />;
    case "agents":      return <Agents      data={data} hue={self.hue} />;
    case "graph":       return <Graph       data={data} hue={self.hue} />;
    case "matrix":      return <Matrix      data={data} hue={self.hue} />;
    case "memorial":    return <Memorial    data={data} hue={self.hue} />;
    case "compression": return <Compression data={data} hue={self.hue} />;
    case "memory":      return <Memory      data={data} hue={self.hue} />;
    default:            return null;
  }
}
