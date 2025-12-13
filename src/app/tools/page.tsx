"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Wrench } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface Tool {
  id: string;
  title: string;
  description: string;
  url: string;
  icon?: string;
  category?: string;
  createdAt: Date;
}

export default function ToolsPage() {
  const { toast } = useToast();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const q = query(collection(db, "tools"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const toolsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Tool[];

      setTools(toolsData);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(toolsData.map((tool) => tool.category || "عام"))
      );
      setCategories(["الكل", ...uniqueCategories]);
    } catch (error) {
      console.error("Error fetching tools:", error);
      toast({
        title: "خطأ",
        description: "فشل تحميل الأدوات. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToolClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const filteredTools = selectedCategory === "الكل"
    ? tools
    : tools.filter((tool) => (tool.category || "عام") === selectedCategory);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 md:py-16 md:px-6">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 md:py-16 md:px-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wrench className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">
              الأدوات المفيدة
            </h1>
          </div>
          <p className="text-lg text-gray-300">
            مجموعة من الأدوات المفيدة للمطورين ومسؤولي الشبكات
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={
                  selectedCategory === category
                    ? "btn-primary"
                    : "glass hover:bg-white/10"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <Card className="glass text-center py-12">
            <CardContent>
              <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 text-lg">
                {selectedCategory === "الكل"
                  ? "لا توجد أدوات متاحة حالياً"
                  : `لا توجد أدوات في فئة "${selectedCategory}"`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <Card
                key={tool.id}
                className="glass hover:scale-105 transition-transform cursor-pointer group"
                onClick={() => handleToolClick(tool.url)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {tool.icon ? (
                        <span className="text-3xl">{tool.icon}</span>
                      ) : (
                        <Wrench className="h-8 w-8 text-primary" />
                      )}
                      <CardTitle className="text-xl text-white">
                        {tool.title}
                      </CardTitle>
                    </div>
                    <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                  {tool.category && (
                    <span className="inline-block px-2 py-1 text-xs bg-primary/20 text-primary rounded">
                      {tool.category}
                    </span>
                  )}
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 mb-4">
                    {tool.description}
                  </CardDescription>
                  <Button className="btn-primary w-full group-hover:bg-primary/90">
                    <ExternalLink className="h-4 w-4 ml-2" />
                    فتح الأداة
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
