defmodule WordchartsWeb.ChartChannelTest do
  use WordchartsWeb.ChannelCase, async: true
  alias WordchartsWeb.ChartChannel
  alias Wordcharts.Charts

  import Wordcharts.ChartsFixtures
  import Mox

  setup do
    %{chart: chart} = create_chart(%{})

    {:ok, _, socket} =
      WordchartsWeb.ChartSocket
      |> socket("", %{})
      |> subscribe_and_join(ChartChannel, "chart:" <> chart.id, %{})

    %{socket: socket, chart: chart}
  end

  test "list_words", %{socket: socket} do
    ref = push(socket, "list_words")
    assert_reply ref, :ok, []
  end

  test "new_words with tagger", %{socket: socket, chart: chart} do
    Wordcharts.HTTPClientMock
    |> expect(:post, fn url, body, header ->
      assert url == "localhost/tagged_words?lang=en"
      assert body == "Test"
      assert header == [{"Accept", "application/json"}]

      {:ok,
       %HTTPoison.Response{
         body:
           [%{"original" => "Test", "wordClass" => "NN", "normalized" => "Test"}]
           |> Jason.encode!(),
         status_code: 200
       }}
    end)

    push(socket, "new_words", %{
      "words" => "Test",
      "admin_url_id" => chart.admin_url_id,
      "taggerActive" => true
    })

    assert_broadcast "update_word_list",
                     %{
                       words: [
                         %{name: "Test", value: 1, grammatical_categories: ["noun"]}
                       ]
                     },
                     500
  end

  test "new_words wtihout tagger", %{socket: socket, chart: chart} do
    push(socket, "new_words", %{
      "words" => "Test",
      "admin_url_id" => chart.admin_url_id,
      "taggerActive" => false
    })

    assert_broadcast "update_word_list",
                     %{
                       words: [
                         %{name: "Test", value: 1, grammatical_categories: ["misc"]}
                       ]
                     },
                     500
  end

  test "change_grammatical_category", %{socket: socket, chart: chart} do
    new_grammatical_category = "noun"

    {:ok, word} =
      Charts.create_word(%{
        name: "test",
        chart_id: chart.id,
        value: 1,
        grammatical_categories: ["NP"]
      })

    push(socket, "change_grammatical_category", %{
      word_name: word.name,
      grammatical_category: new_grammatical_category,
      admin_url_id: chart.admin_url_id
    })

    assert_broadcast "update_word_list",
                     %{
                       words: [
                         %{
                           name: "test",
                           value: 1,
                           grammatical_categories: [^new_grammatical_category]
                         }
                       ]
                     },
                     500
  end

  test "clear_words", %{socket: socket, chart: chart} do
    Charts.create_word(%{name: "test", chart_id: chart.id, value: 1})
    push(socket, "clear_words", %{"admin_url_id" => chart.admin_url_id})
    assert_broadcast "update_word_list", %{words: []}
  end

  test "delete_word", %{socket: socket, chart: chart} do
    Charts.create_word(%{name: "test", chart_id: chart.id, value: 1})

    push(socket, "delete_word", %{"word_name" => "test", "admin_url_id" => chart.admin_url_id})

    assert_broadcast "update_word_list", %{words: []}
  end

  test "update_chart settings", %{socket: socket, chart: %{id: id, name: name} = chart} do
    push(socket, "update_chart", %{
      "settings" => %{"wordchartsSettings" => %{"fontSize" => 16}},
      "admin_url_id" => chart.admin_url_id
    })

    assert_broadcast "update_chart", %{
      id: ^id,
      name: ^name,
      settings: %{"wordchartsSettings" => %{"fontSize" => 16}},
      grammatical_search_filter: [],
      language: "en"
    }
  end

  test "update_chart filter", %{socket: socket, chart: %{id: id, name: name} = chart} do
    push(socket, "update_chart", %{
      "grammatical_search_filter" => ["noun"],
      "admin_url_id" => chart.admin_url_id
    })

    assert_broadcast "update_chart", %{
      id: ^id,
      name: ^name,
      settings: %{},
      grammatical_search_filter: ["noun"],
      language: "en"
    }
  end

  test "update_chart language", %{socket: socket, chart: %{id: id, name: name} = chart} do
    word_fixture(%{chart_id: chart.id})

    Wordcharts.HTTPClientMock
    |> expect(:post, fn url, body, header ->
      assert url == "localhost/tagged_words?lang=de"
      assert body == "some name"
      assert header == [{"Accept", "application/json"}]

      {:ok,
       %HTTPoison.Response{
         body:
           [%{"original" => "some name", "wordClass" => "NN", "normalized" => "some name"}]
           |> Jason.encode!(),
         status_code: 200
       }}
    end)

    push(socket, "update_chart", %{
      "language" => "de",
      "admin_url_id" => chart.admin_url_id
    })

    assert_broadcast "update_word_list", %{
      words: [%{name: "some name", grammatical_categories: ["noun"], value: 1}]
    }

    assert_broadcast "update_chart", %{
      id: ^id,
      name: ^name,
      settings: %{},
      grammatical_search_filter: [],
      language: "de"
    }
  end

  defp create_chart(_) do
    chart = chart_fixture()
    %{chart: chart}
  end
end
