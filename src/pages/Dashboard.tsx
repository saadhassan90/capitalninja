const Dashboard = () => {
  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your activity</p>
        </div>
      </div>
      <div className="grid gap-6">
        <div className="rounded-lg border bg-card p-6">
          <p className="text-lg">Welcome to your dashboard!</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;