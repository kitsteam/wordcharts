defmodule WordchartsWeb.ChartControllerTest do
  use WordchartsWeb.ConnCase

  import Wordcharts.ChartsFixtures

  @create_attrs %{name: "some name", settings: %{}, language: "de"}
  @update_attrs %{name: "some updated name", settings: %{}}
  @invalid_attrs %{settings: "not a json object"}

  describe "create chart" do
    test "redirects to show when data is valid", %{conn: conn} do
      conn = post(conn, Routes.chart_path(conn, :create), chart: @create_attrs)

      assert %{
               "name" => "some name"
             } = json_response(conn, 201)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.chart_path(conn, :create), chart: @invalid_attrs)

      assert %{
               "settings" => ["is invalid"]
             } = json_response(conn, 422)["errors"]
    end
  end

  describe "update chart" do
    setup [:create_chart]

    test "renders chart when data is valid", %{
      conn: conn,
      chart: %{id: id, admin_url_id: admin_url_id} = chart
    } do
      conn =
        build_conn()
        |> put_req_header("admin-url-id", admin_url_id)
        |> put(Routes.chart_path(conn, :update, chart),
          chart: Map.merge(@update_attrs, %{admin_url_id: admin_url_id})
        )

      assert %{
               "id" => ^id,
               "name" => "some updated name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{
      conn: conn,
      chart: %{admin_url_id: admin_url_id} = chart
    } do
      conn =
        build_conn()
        |> put_req_header("admin-url-id", admin_url_id)
        |> put(Routes.chart_path(conn, :update, chart), chart: @invalid_attrs)

      assert json_response(conn, 422)["errors"] != %{}
    end

    test "renders unauthorized when missing admin id", %{conn: conn, chart: chart} do
      conn = put(conn, Routes.chart_path(conn, :update, chart), chart: @update_attrs)
      assert conn.status == 401
    end
  end

  describe "delete chart" do
    setup [:create_chart]

    test "deletes chosen chart", %{
      conn: conn,
      chart: %{id: id, admin_url_id: admin_url_id} = chart
    } do
      conn =
        build_conn()
        |> put_req_header("admin-url-id", admin_url_id)
        |> delete(Routes.chart_path(conn, :delete, id))

      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.chart_path(conn, :show, chart))
      end
    end

    test "renders unauthorized when missing admin id", %{conn: conn, chart: chart} do
      conn = delete(conn, Routes.chart_path(conn, :delete, chart))
      assert conn.status == 401
    end
  end

  defp create_chart(_) do
    chart = chart_fixture()
    %{chart: chart}
  end
end
