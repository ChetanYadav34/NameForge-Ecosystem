import { GraphView, LayoutEngine, GraphNode } from "./types";

export class ForceLayout implements LayoutEngine {
  id = "force";
  name = "Force Directed";

  layout(view: GraphView): GraphView {
    const nodes = [...view.nodes];
    const edges = view.edges;
    
    // Initialize positions randomly in a circle if they don't exist
    nodes.forEach((node, i) => {
      if (node.x === undefined || node.y === undefined) {
        // If it's the very first node (often root), put it at center
        if (i === 0) {
          node.x = 0;
          node.y = 0;
        } else {
          const angle = Math.random() * 2 * Math.PI;
          const radius = 50 + Math.random() * 100;
          node.x = Math.cos(angle) * radius;
          node.y = Math.sin(angle) * radius;
        }
      }
    });

    // Extremely basic force simulation
    const iterations = 50;
    const repulsion = 5000;
    const springLength = 150;
    const springForce = 0.05;
    const dampening = 0.8;

    // velocities
    const v = new Map<string, { vx: number, vy: number }>();
    nodes.forEach(n => v.set(n.id, { vx: 0, vy: 0 }));

    for (let iter = 0; iter < iterations; iter++) {
      // Repulsion
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n1.x! - n2.x!;
          const dy = n1.y! - n2.y!;
          let distSq = dx * dx + dy * dy;
          if (distSq === 0) distSq = 0.01;
          
          const force = repulsion / distSq;
          const dist = Math.sqrt(distSq);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          v.get(n1.id)!.vx += fx;
          v.get(n1.id)!.vy += fy;
          v.get(n2.id)!.vx -= fx;
          v.get(n2.id)!.vy -= fy;
        }
      }

      // Spring attraction
      for (const edge of edges) {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        
        if (sourceNode && targetNode) {
          const dx = targetNode.x! - sourceNode.x!;
          const dy = targetNode.y! - sourceNode.y!;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
          
          const force = (dist - springLength) * springForce;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          v.get(sourceNode.id)!.vx += fx;
          v.get(sourceNode.id)!.vy += fy;
          v.get(targetNode.id)!.vx -= fx;
          v.get(targetNode.id)!.vy -= fy;
        }
      }

      // Apply velocities
      for (const node of nodes) {
        // Fix the root node roughly in center for stability
        if (node === nodes[0]) {
          node.x = 0;
          node.y = 0;
          continue;
        }
        const vel = v.get(node.id)!;
        node.x! += vel.vx;
        node.y! += vel.vy;
        vel.vx *= dampening;
        vel.vy *= dampening;
      }
    }

    return {
      ...view,
      nodes
    };
  }
}

export class CircleLayout implements LayoutEngine {
  id = "circle";
  name = "Circle Layout";

  layout(view: GraphView): GraphView {
    const nodes = [...view.nodes];
    if (nodes.length === 0) return view;

    // First node is center
    if (nodes[0]) {
      nodes[0].x = 0;
      nodes[0].y = 0;
    }

    const radius = 250;
    for (let i = 1; i < nodes.length; i++) {
      const angle = ((i - 1) / (nodes.length - 1)) * 2 * Math.PI;
      nodes[i].x = Math.cos(angle) * radius;
      nodes[i].y = Math.sin(angle) * radius;
    }

    return { ...view, nodes };
  }
}

export class RadialLayout implements LayoutEngine {
  id = "radial";
  name = "Radial Layout";

  layout(view: GraphView): GraphView {
    const nodes = [...view.nodes];
    if (nodes.length === 0) return view;

    // Compute depths via BFS
    const adj = new Map<string, string[]>();
    view.edges.forEach(e => {
      if (!adj.has(e.source)) adj.set(e.source, []);
      if (!adj.has(e.target)) adj.set(e.target, []);
      adj.get(e.source)!.push(e.target);
      adj.get(e.target)!.push(e.source);
    });

    const depths = new Map<string, number>();
    const queue = [{ id: nodes[0].id, depth: 0 }];
    depths.set(nodes[0].id, 0);

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;
      for (const n of adj.get(id) || []) {
        if (!depths.has(n)) {
          depths.set(n, depth + 1);
          queue.push({ id: n, depth: depth + 1 });
        }
      }
    }

    // Group nodes by depth
    const nodesByDepth = new Map<number, GraphNode[]>();
    nodes.forEach(n => {
      const d = depths.get(n.id) ?? 1; // Default to 1 if disconnected
      if (!nodesByDepth.has(d)) nodesByDepth.set(d, []);
      nodesByDepth.get(d)!.push(n);
    });

    const layerRadius = 200;

    for (const [depth, layerNodes] of nodesByDepth.entries()) {
      if (depth === 0) {
        layerNodes[0].x = 0;
        layerNodes[0].y = 0;
      } else {
        const radius = depth * layerRadius;
        layerNodes.forEach((n, i) => {
          const angle = (i / layerNodes.length) * 2 * Math.PI;
          n.x = Math.cos(angle) * radius;
          n.y = Math.sin(angle) * radius;
        });
      }
    }

    return { ...view, nodes };
  }
}

export class TreeLayout implements LayoutEngine {
  id = "tree";
  name = "Tree Layout";

  layout(view: GraphView): GraphView {
    const nodes = [...view.nodes];
    if (nodes.length === 0) return view;

    // Build directed tree
    const adj = new Map<string, string[]>();
    const inDegree = new Map<string, number>();
    
    nodes.forEach(n => inDegree.set(n.id, 0));
    view.edges.forEach(e => {
      if (!adj.has(e.source)) adj.set(e.source, []);
      adj.get(e.source)!.push(e.target);
      inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
    });

    // Find root (node with 0 in-degree, or fallback to first node)
    let root = nodes.find(n => inDegree.get(n.id) === 0) || nodes[0];

    // Compute depths for tree
    const depths = new Map<string, number>();
    const queue = [{ id: root.id, depth: 0 }];
    depths.set(root.id, 0);

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;
      for (const n of adj.get(id) || []) {
        if (!depths.has(n)) {
          depths.set(n, depth + 1);
          queue.push({ id: n, depth: depth + 1 });
        }
      }
    }

    // Group nodes by depth
    const nodesByDepth = new Map<number, GraphNode[]>();
    let maxDepth = 0;
    nodes.forEach(n => {
      const d = depths.get(n.id) ?? 0;
      if (d > maxDepth) maxDepth = d;
      if (!nodesByDepth.has(d)) nodesByDepth.set(d, []);
      nodesByDepth.get(d)!.push(n);
    });

    const levelHeight = 150;
    const nodeSpacing = 200;

    for (let d = 0; d <= maxDepth; d++) {
      const layerNodes = nodesByDepth.get(d) || [];
      const totalWidth = (layerNodes.length - 1) * nodeSpacing;
      let startX = -totalWidth / 2;

      layerNodes.forEach(n => {
        n.x = startX;
        n.y = d * levelHeight;
        startX += nodeSpacing;
      });
    }

    return { ...view, nodes };
  }
}
