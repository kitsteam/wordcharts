defmodule WordchartsService.NlpServiceTest do
  use ExUnit.Case, async: true
  import Mox

  alias WordchartsService.NlpService

  @http_client Wordcharts.HTTPClientMock
  @success_resp [%{"original" => "Test", "wordClass" => "NN", "normalized" => "Test"}]

  describe "tag_words" do
    test "tag_words/2 returns mapped string" do
      @http_client
      |> expect(:post, fn url, body, header ->
        assert url == "localhost/tagged_words?lang=en"
        assert body == "Test"
        assert header == [{"Accept", "application/json"}]
        {:ok, %HTTPoison.Response{body: @success_resp |> Jason.encode!(), status_code: 200}}
      end)

      assert [%{"grammatical_categories" => ["noun"], "name" => "Test"}] ==
               NlpService.tag_words("Test")
    end

    test "tag_words/2 excludes comma" do
      @http_client
      |> expect(:post, fn url, body, header ->
        assert url == "localhost/tagged_words?lang=en"
        assert body == ","
        assert header == [{"Accept", "application/json"}]

        {:ok,
         %HTTPoison.Response{
           body:
             [%{"original" => ",", "wordClass" => ",", "normalized" => ","}] |> Jason.encode!(),
           status_code: 200
         }}
      end)

      assert [] == NlpService.tag_words(",")
    end

    test "tag_words/2 excludes dot" do
      @http_client
      |> expect(:post, fn url, body, header ->
        assert url == "localhost/tagged_words?lang=en"
        assert body == "."
        assert header == [{"Accept", "application/json"}]

        {:ok,
         %HTTPoison.Response{
           body:
             [%{"normalized" => ".", "original" => ".", "wordClass" => "."}] |> Jason.encode!(),
           status_code: 200
         }}
      end)

      assert [] == NlpService.tag_words(".")
    end
  end
end
