defmodule DemoPhoenixInertiaSvelte.Tetris.ScoreBuffer do
  use GenServer
  require Logger
  import Ecto.Query

  alias DemoPhoenixInertiaSvelte.Repo
  alias DemoPhoenixInertiaSvelte.Tetris.HighScore

  @flush_interval 5_000

  def start_link(_opts) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def submit_score(attrs) do
    GenServer.cast(__MODULE__, {:submit_score, attrs})
  end

  def get_top_scores(limit \\ 10) do
    GenServer.call(__MODULE__, {:get_top_scores, limit})
  end

  @impl true
  def init(_) do
    schedule_flush()
    {:ok, []}
  end

  @impl true
  def handle_cast({:submit_score, attrs}, scores) do
    case HighScore.changeset(%HighScore{}, attrs) do
      %Ecto.Changeset{valid?: true} = changeset ->
        {:noreply, [changeset | scores]}
      
      invalid_changeset ->
        Logger.warning("Invalid score submission: #{inspect(invalid_changeset.errors)}")
        {:noreply, scores}
    end
  end

  @impl true
  def handle_call({:get_top_scores, _limit}, _from, scores) do
    top_scores = 
      HighScore
      |> Ecto.Query.order_by(desc: :score)
      |> Ecto.Query.limit(10)
      |> Repo.all()
    
    {:reply, top_scores, scores}
  end

  @impl true
  def handle_info(:flush, scores) do
    if length(scores) > 0 do
      score_data = Enum.map(scores, &Ecto.Changeset.apply_changes/1)
      
      case Repo.insert_all(HighScore, score_data, returning: false) do
        {count, _} when count > 0 ->
          Logger.info("Flushed #{count} high scores to database")
        
        _ ->
          Logger.warning("Failed to flush scores to database")
      end
    end
    
    schedule_flush()
    {:noreply, []}
  end

  defp schedule_flush do
    Process.send_after(self(), :flush, @flush_interval)
  end
end
