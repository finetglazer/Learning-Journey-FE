import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, Bookmark, ArrowUp, HandHeart, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useContext } from "react";
import { AppContext } from "@/hooks/app-context";
import { PostPageContext } from "./post-page-context";
import { cn } from "@/lib/utils";

export function PostPageHeader() {
    const { displayName } = useContext(AppContext);
    const { 
        activeFilter, 
        setActiveFilter, 
        setIsCreateNewPost,
    } = useContext(PostPageContext);

    const handleFilterClick = (filter: string) => {
        if (activeFilter === filter) {
            setActiveFilter(null);
        } else {
            setActiveFilter(filter);
        }
    };

    const getButtonClass = (filter: string) => {
        const isActive = activeFilter === filter;
        return cn(
            "gap-2 cursor-pointer transition-colors",
            isActive
                ? "bg-teal-500 text-white hover:bg-teal-500"
                : "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
        );
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-start gap-3">
                    <HandHeart className="h-8 w-8 text-muted-foreground mt-1" />
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">
                            Welcome back, {displayName || "Anonymous"}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Seek out help for your questions and help others answer theirs
                        </p>
                    </div>
                </div>
                <Button className="gap-2 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white shadow-sm shrink-0"
                    onClick={() => setIsCreateNewPost(true)}
                >
                    <Plus className="h-4 w-4" />
                    Ask for help
                </Button>
            </div>

            <Separator />

            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Page posts</h1>
                <p className="text-muted-foreground text-base">
                    By default, this page will show the popular topics or you can also
                    search your expected posts by filter options. <br />
                    Hope you see what you need
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-[320px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search posts"
                        className="pl-9 bg-muted/50 border-none shadow-none focus-visible:ring-1"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                        variant="ghost"
                        className={getButtonClass("my_posts")}
                        onClick={() => handleFilterClick("my_posts")}
                    >
                        <User className="h-4 w-4" />
                        My posts
                    </Button>
                    <Button
                        variant="ghost"
                        className={getButtonClass("saved_posts")}
                        onClick={() => handleFilterClick("saved_posts")}
                    >
                        <Bookmark className="h-4 w-4" />
                        Saved posts
                    </Button>
                    <Button
                        variant="ghost"
                        className={getButtonClass("most_helpful")}
                        onClick={() => handleFilterClick("most_helpful")}
                    >
                        <ArrowUp className="h-4 w-4" />
                        Most helpful
                    </Button>
                </div>
            </div>
        </div>
    );
}
