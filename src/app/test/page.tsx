export default function TestPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-blue-900 mb-4">
                    Test Page
                </h1>
                <p className="text-blue-700">
                    If you can see this page, routing is working!
                </p>
                <p className="text-sm text-blue-600 mt-4">
                    URL: /test
                </p>
            </div>
        </div>
    );
} 