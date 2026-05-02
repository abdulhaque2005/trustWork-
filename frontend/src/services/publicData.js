export const fetchPublicData = async () => {
  try {
    const res = await fetch("https://dummyjson.com/products?limit=8");
    const data = await res.json();
    const transformed = data.products.map(p => ({
      _id: `pub-${p.id}`,
      title: p.title,
      budget: p.price * 10,
      deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
      description: p.description,
      status: "new",
      progress: 0,
      freelancerId: null,
      milestones: []
    }));
    return { projects: transformed };
  } catch (error) {
    console.error("Failed to fetch public data:", error);
    return { projects: [] };
  }
};
