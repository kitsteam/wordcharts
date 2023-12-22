defmodule WordchartsWeb.WordControllerTest do
  use WordchartsWeb.ConnCase

  import Wordcharts.ChartsFixtures

  @create_attrs %{
    name: "some name"
  }

  @chart_attrs %{
    name: "some name",
    settings: %{},
    chart_type: "feedback"
  }

  @invalid_attrs %{name: nil}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "create word" do
    test "renders word when data is valid", %{conn: conn} do
      chart = chart_fixture(@chart_attrs)

      conn =
        post(conn, Routes.word_path(conn, :create, chart.id),
          word: Map.merge(@create_attrs, %{chart_id: chart.id})
        )

      assert json_response(conn, 201)["errors"] == nil
    end

    test "renders errors when data is invalid", %{conn: conn} do
      chart = chart_fixture(@chart_attrs)
      conn = post(conn, Routes.word_path(conn, :create, chart.id), word: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "create multiple words" do
    test "renders words when data is valid", %{conn: conn} do
      chart = chart_fixture(@chart_attrs)

      conn =
        post(conn, Routes.word_path(conn, :create, chart.id),
          words: [
            Map.merge(@create_attrs, %{"chart_id" => chart.id}),
            Map.merge(@create_attrs, %{"chart_id" => chart.id})
          ]
        )

      assert json_response(conn, 201)["errors"] == nil
    end

    test "raises error when name is missing", %{conn: conn} do
      chart = chart_fixture(@chart_attrs)

      assert_raise Postgrex.Error, fn ->
        post(conn, Routes.word_path(conn, :create, chart.id), words: [@invalid_attrs])
      end
    end
  end
end
